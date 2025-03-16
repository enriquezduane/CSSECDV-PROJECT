const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            id: user.id,
            username: user.username,
            role: user.role,
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // make sure it is in .env file
            { expiresIn: '1d' }, // 1 day
            (err, token) => {
                if (err) {
                    reject(new Error('Error signing token: ' + err.message))
                }
                resolve(token)
            },
        )
    })
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error('Invalid token: ' + err.message))
            }
            resolve(decoded)
        })
    })

}

const findUserByJwt = async (token) => {
    try {
        const decoded = await verifyToken(token)
        const user = await User.findById(decoded.id)
        if (!user) {
            throw new Error('User not found')
        }
        return user
    } catch (error) {
        throw error
    }
}

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' })
        }

        console.log('decoding..')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('decoded..')
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' })
        }

        req.user = user // Attach user info to the request object
        next()
    } catch (error) {
        console.error('Authentication error:', error)
        res.status(401).json({ message: 'Unauthorized: Invalid token' })
    }
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
        }
        next()
    }
}

module.exports = {
    signToken,
    verifyToken,
    findUserByJwt,
    protect,
    authorize
}
