const User = require('../models/User')

// create new user
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// get user
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// get by single id
exports.getUserById = async (req, res) => {
    try {
        // uses 'id' key
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// update user
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// update password
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