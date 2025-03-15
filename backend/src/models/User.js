const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const handleDuplicateKeyError = require('../utils/errorHandler')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['cashier', 'manager'],
        required: true,
    },
    failedAttempts: {
        type: Number,
        default: 0,
    },
    isLocked: {
        type: Boolean,
        default: false,
    },
    lockUntil: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    securityQuestions: [
        {
            question: { type: String, required: false },
            answerHash: { type: String, required: false },
        },
    ],
    
}, {
    // Modify _id to id and remove __v
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            return ret
        },
    },
})

// Middleware to reset failed attempts after successful login
userSchema.methods.resetFailedAttempts = async function() {
    this.failedAttempts = 0
    this.isLocked = false
    this.lockUntil = null
    await this.save()
}

// hash password before saving to db
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }

    if (this.isModified('securityQuestions')) {
        this.securityQuestions = await Promise.all(
            this.securityQuestions.map(async (q) => {
                if (!q.answerHash || q.isModified) {
                    return {
                        question: q.question,
                        answerHash: await bcrypt.hash(q.answerHash, 10), // Hash the answer
                    }
                }
                return q // Skip already hashed answers
            })
        )
    }
    next()
})

userSchema.post('save', function(error, doc, next) {
    handleDuplicateKeyError(error, next)
})

userSchema.post('findOneAndUpdate', function(error, res, next) {
    handleDuplicateKeyError(error, next)
})

const User = mongoose.model('User', userSchema)

module.exports = User
