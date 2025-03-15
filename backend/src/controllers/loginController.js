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

        const token = await jwtHandler.signToken(user)

        res.status(200).json({
            token,
            username: user.username,
            role: user.role,
            id: user.id,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const { newPassword, securityAnswers } = req.body

        // Find the user by ID
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })

        // Check if the user has security questions
        if (user.securityQuestions && user.securityQuestions.length > 0) {
            if (!securityAnswers || securityAnswers.length !== user.securityQuestions.length) {
                return res.status(400).json({ message: 'Security answers are required' })
            }

            // Validate the security answers
            const isValid = await Promise.all(
                user.securityQuestions.map((q, index) =>
                    bcrypt.compare(securityAnswers[index], q.answerHash)
                )
            )

            if (isValid.includes(false)) {
                return res.status(401).json({ message: 'Incorrect answers to security questions' })
            }
        }

        // Update the user's password
        user.password = newPassword
        await user.save()

        res.status(200).json({ message: 'Password updated successfully' })
    } catch (error) {
        console.error('Error updating password:', error)
        res.status(500).json({ message: error.message })
    }
}