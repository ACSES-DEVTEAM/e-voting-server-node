const express = require('express')

const userController = require('../controllers/userController')

const userAuthenticate = require('../middlewares/userAuthenticate')

const router = express.Router()

// Routes
router.post('/login', userController.login_user)

router.post('/signup', userController.signup_user)

// require authenticate for User routes
// router.use(userAuthenticate)

router.get('/getUsers', userController.getUsers)

router.get('/getDepartmentUsers', userController.getSumOfUsersFromDepartments)

router.get('/getUsersFullInfo', userController.getAllUsersFullInfo)

router.get('/getUser/:id', userController.getUser)

router.delete('/deleteUser/:id', userController.deleteUser)

router.put('/updateUser/:id', userController.updateUser)

router.put('/updateUserByIndexNumber', userController.updateUserByIndexNumber)


module.exports = router