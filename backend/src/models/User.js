const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const handleDuplicateKeyError = require('../utils/errorHandler')

const securityQuestionsList = require('../utils/securityQuestions')

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
    currentLogin: {
        type: Date,
        default: null,
    },
    previousLogin: {
        type: Date,
        default: null,
    },
    securityQuestions: [
        {
            question: {
                type: String,
                required: false,
                enum: securityQuestionsList,
            },
            answerHash: { type: String, required: false },
        },
    ],
}, {
    // Modify _id to id, remove __v, and format login dates
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v

            // Helper function to format dates in YYYY-MM-DD HH:MM (24-hour format)
            const formatDate = (date) => {
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                const hours = String(date.getHours()).padStart(2, '0')
                const minutes = String(date.getMinutes()).padStart(2, '0')
                return `${year}-${month}-${day} ${hours}:${minutes}`
            }

            // Format login dates
            if (ret.currentLogin) {
                ret.currentLogin = formatDate(new Date(ret.currentLogin))
            }

            if (ret.previousLogin) {
                ret.previousLogin = formatDate(new Date(ret.previousLogin))
            }

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

userSchema.methods.formatDate = function(date) {
    if (!date) return null

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
}

// Hash password and security questions before saving to db
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


userSchema.pre('findOneAndUpdate', async function(next) {
    const update = this.getUpdate()

    // Hash the password if it is being updated
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10)
    }

    // Hash security question answers if they are being updated
    if (update.securityQuestions) {
        update.securityQuestions = await Promise.all(
            update.securityQuestions.map(async (q) => {
                if (q.answerHash) {
                    return {
                        question: q.question,
                        answerHash: await bcrypt.hash(q.answerHash, 10),
                    }
                }
                return q
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
