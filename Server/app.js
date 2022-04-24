const express = require("express");
const cors = require("cors");
const userControllers = require("./controllers/users-controllers");
const vacationsControllers = require("./controllers/vacations-controllers");
const followControllers = require("./controllers/follow-controllers");
const vacationImageControllers = require("./controllers/vacation-image-controllers");
const vacationLogic = require("./bll/vacations-logic");
const followLogic = require("./bll/follows-logic");

const socketIo = require("socket.io");
const http = require("http");

const expressServer = express();

expressServer.use(express.json());

expressServer.use(cors());

expressServer.use("/api/users", userControllers);
expressServer.use("/api/vacations", vacationsControllers);
expressServer.use("/api/follows", followControllers);
expressServer.use("/api/vacationImage", vacationImageControllers);

const httpServer = http.createServer(expressServer).listen(3001, () => console.log("Listening on http://localhost:3001"));
const socketServer = socketIo.listen(httpServer);

const allSockets = [];

expressServer.use(express.static(__dirname));

socketServer.sockets.on("connection", async socket => {
    allSockets.push(socket);
    console.log("One client has been connected. Total clients: " + allSockets.length);

    socket.on("admin-made-changes", async () => {
        console.log("Admin made changes.");
        socketServer.sockets.emit("admin-made-changes", await vacationLogic.getAllVacations());
    });

    socket.on("user-made-changes", async () => {
        console.log("User made changes.");
        socketServer.sockets.emit("user-made-changes", await followLogic.getAllFollows());
    });

    socket.on("disconnect", () => {
        const index = allSockets.indexOf(socket);
        allSockets.splice(index, 1);
        console.log("Client Disconnected. Total Clients: " + allSockets.length)
    });
});

expressServer.listen(3002, () => console.log("Listening on http://localhost:3002"));