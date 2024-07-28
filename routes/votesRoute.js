const express = require("express");

const voteController = require("../controllers/voteController");

const Authenticate = require("../middlewares/adminAuthenticate");

const router = express.Router();


// Routes
router.get("/getVotes", voteController.getVotes);

router.post("/addVote/:id", voteController.addVote);

router.get("/getTotalVotes", voteController.getTotalVotes);

// router.use(Authenticate);

router.post("/resetVote", voteController.resetVote);

module.exports = router;
