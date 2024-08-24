const express = require("express");

const voteController = require("../controllers/voteController");

const Authenticate = require("../middlewares/adminAuthenticate");

const router = express.Router();


// Routes
router.get("/getVotes", voteController.getVotes);

router.post("/addVote/:id", voteController.addVote);

router.get("/getTotalVotes", voteController.getTotalVotes);

router.get("/getUsersWhoHaveVoted", voteController.getUsersWhoHaveVoted);

router.get("/getUsersWhoHaveNotVoted", voteController.getUsersWhoHaveNotVoted);

router.get("/getUsersWhoHaveVotedByDepartment/:department", voteController.getUsersWhoHaveVotedByDepartment);

router.get("/getUsersWhoHaveNotVotedByDepartment/:department", voteController.getUsersWhoHaveNotVotedByDepartment);

// router.use(Authenticate);

router.post("/resetVote", voteController.resetVote);

router.post("/removeVote", voteController.removeVote);

module.exports = router;
