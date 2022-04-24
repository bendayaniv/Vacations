const express = require("express");
const usersLogic = require("../bll/users-logic");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const users = await usersLogic.getAllUsers();
        response.json(users);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const user = await usersLogic.getOneUser(id);
        response.json(user);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.post("/", async (request, response) => {
    try {
        const user = request.body;
        const addedUser = await usersLogic.addUser(user);
        response.status(201).json(addedUser);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.put("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const user = request.body;
        user.userID = id;
        const updatedUser = await usersLogic.updateUser(user);
        response.json(updatedUser);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await usersLogic.deleteUser(id);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

module.exports = router;