const express = require('express')

const associationController = require('../controllers/associationController')

const router = express.Router()

// Routes
router.get('/getAllAssociations', associationController.getAllAssociations)

router.post('/signupAssociation', associationController.signupAssociation)

router.put('/updateAssociation', associationController.updateAssociation)

router.get('/getAssociationByName', associationController.getAssociationByName)

router.delete('/deleteAssociation', associationController.deleteAssociation)


module.exports = router
