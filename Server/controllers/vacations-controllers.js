const express = require("express");
const vacationsLogic = require("../bll/vacations-logic");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const vacations = await vacationsLogic.getAllVacations();
        response.json(vacations);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = await vacationsLogic.getOneVacation(id);
        response.json(vacation);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.post("/", async (request, response) => {
    try {
        const vacation = request.body;
        const addedVacation = await vacationsLogic.addVacation(vacation);
        response.status(201).json(addedVacation);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.patch("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = request.body;
        vacation.vacationID = id;
        const updatedVcation = await vacationsLogic.updatePartialVacation(vacation);
        response.json(updatedVcation);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const vacationID = +request.params.id;
        await vacationsLogic.delelteVacation(vacationID);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).json(err.message);
    }
});

module.exports = router;