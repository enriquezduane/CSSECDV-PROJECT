const express = require('express')
const { protect, authorize } = require('../utils/jwtHandler')

const userRoutes = require('./userRoutes')
const loginRoutes = require('./loginRoutes')
const menuItemRoutes = require('./menuItemRoutes')
const orderRoutes = require('./orderRoutes')
const statisticsRoutes = require('./statisticsRoutes')

const router = express.Router()
router.use('/users', protect, authorize('manager', 'cashier'), userRoutes)
router.use('/login', loginRoutes)
router.use('/menu-items', protect, authorize('manager', 'cashier'), menuItemRoutes)
router.use('/orders', protect, authorize('manager'), orderRoutes)
router.use('/statistics', protect, authorize('manager'), statisticsRoutes)

module.exports = router
