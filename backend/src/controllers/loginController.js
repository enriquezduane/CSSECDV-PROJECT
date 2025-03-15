const User = require('../models/User')
const jwtHandler = require('../utils/jwtHandler')
const bcrypt = require('bcryptjs')

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if (!user) {
            // Log failed attempt for non-existent user
            return res.status(401).json({ message: 'Invalid username and/or password' })
        }

        if (user.isLocked && user.lockUntil > new Date()) {
            return res.status(403).json({ message: 'Account is locked. Try again later.' })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            user.failedAttempts += 1
            if (user.failedAttempts >= 5) {
                user.isLocked = true
                user.lockUntil = new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
            }
            await user.save()
            return res.status(401).json({ message: 'Invalid username and/or password' })
        }

        // Reset failed attempts after successful login
        await user.resetFailedAttempts()

        // Update login timestamps
        user.previousLogin = user.currentLogin // Shift currentLogin to previousLogin
        user.currentLogin = new Date() // Set currentLogin to now
        await user.save()

        const token = await jwtHandler.signToken(user)

        res.status(200).json({
            token,
            username: user.username,
            role: user.role,
            id: user.id,
            previousLogin: user.formatDate(user.previousLogin),
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

exports.reAuthenticate = async (req, res, next) => {
    try {
        const { currentPassword } = req.body
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Re-authentication failed: Incorrect current password' })
        }

        res.status(200).json({ message: 'Re-authentication successful' })
    } catch (error) {
        console.error('Re-authentication error:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}