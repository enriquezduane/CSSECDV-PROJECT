const express = require('express')
const { protect, authorize } = require('../utils/jwtHandler')

const userRoutes = require('./userRoutes')
const loginRoutes = require('./loginRoutes')
const menuItemRoutes = require('./menuItemRoutes')
const orderRoutes = require('./orderRoutes')
const statisticsRoutes = require('./statisticsRoutes')

const router = express.Router()
router.use('/users', protect, userRoutes)
router.use('/login', loginRoutes)
router.use('/menu-items', protect, menuItemRoutes)
router.use('/orders', protect, orderRoutes)
router.use('/statistics', protect, statisticsRoutes)

module.exports = router
