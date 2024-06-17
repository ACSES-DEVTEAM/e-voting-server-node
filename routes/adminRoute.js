const express = require('express')
const adminController = require('../controllers/adminController')
const router = express.Router()

// Routes
router.post('/signup_admin', adminController.signup_admin)

router.post('/login_admin', adminController.login_admin)

router.get('/getAdmin/:id', adminController.getAdmin)

router.get('/getAdmins', adminController.getAdmins)

router.delete('/deleteAdmin/:id', adminController.deleteAdmin)

router.put('/updateAdmin/:id', adminController.updateAdmin)


module.exports = router