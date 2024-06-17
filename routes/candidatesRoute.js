const express = require('express')

const candidateController = require('../controllers/candidateController')

const Authenticate = require('../middlewares/userAuthenticate')

const router = express.Router()

// Routes
//router.use(Authenticate);

router.post('/signup', candidateController.createCandidate)

router.get('/getCandidates', candidateController.getCandidates)

router.get('/getCandidate/', candidateController.getCandidate)

router.delete('/deleteCandidate/:id', candidateController.deleteCandidate)

router.put('/updateCandidate/:id', candidateController.updateCandidate)


module.exports = router