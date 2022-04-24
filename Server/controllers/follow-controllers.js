const express = require("express");
const followsLogic = require("../bll/follows-logic");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const follows = await followsLogic.getAllFollows();
        response.json(follows);
    }
    catch(err) {
        response.status(500).json(err.message);
    }
});

router.get("/:userID", async (request, response) => {
    try {
        const userID = +request.params.userID;
        const follows = await followsLogic.getFollowsOfSpecificUser(userID);
        response.json(follows);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.get("/:userID/:vacationID", async (request, response) => {
    try {
        const userID = +request.params.userID;
        const vacationID = +request.params.vacationID;
        console.log(userID + ", " + vacationID);
        const follow = await followsLogic.getSpecificFollowOfSpecificUser(userID, vacationID);
        response.json(follow);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
})

router.post("/", async (request, response) => {
    try {
        const follow = request.body;
        console.log(follow);
        const addedFollow = await followsLogic.addFollow(follow);   
        response.status(201).json(addedFollow);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.delete("/:userID/:vacationID", async (request, response) => {
    try {
        const userID = +request.params.userID;
        const vacationID = +request.params.vacationID;
        console.log(userID + ", " + vacationID);
        await followsLogic.deleteSpecificFollowOfUser(userID, vacationID);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).json(err.meassage);
    }
});

router.delete("/:vacationID", async (request, response) => {
    try {
        const vacationID = +request.params.vacationID;
        console.log(vacationID);
        await followsLogic.deleteFollow(vacationID);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).json(err.meassage);
    }
});

module.exports = router;