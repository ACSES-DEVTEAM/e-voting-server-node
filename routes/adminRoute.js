const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

// Routes
router.post('/updateSiteMode', adminController.updateSiteMode)

router.get('/getSiteMode', adminController.getSiteMode)

router.post('/loginAdmin', adminController.loginAdmin)


module.exports = router