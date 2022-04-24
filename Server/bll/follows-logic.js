const dal = require("../dal/dal");

async function getAllFollows() {
    const sql = `select userID, vacationID from follows`;
    const follows = await dal.execute(sql);
    return follows;
};

async function getFollowsOfSpecificUser(userID) {
    const sql = `SELECT follows.userID, follows.vacationID, 
                 vacations.destination, vacations.description, vacations.photoName, vacations.start, vacations.end, vacations.price 
                 from follows JOIN vacations on vacations.vacationID = follows.vacationID 
                 JOIN users ON users.userID = follows.userID where follows.userID = ` + userID;
    const follows = await dal.execute(sql);
    return follows;
}

async function getSpecificFollowOfSpecificUser(userID, vacationID) {
    const sql = `SELECT userID, vacationID FROM follows where follows.userID = `
                 + userID + ` AND follows.vacationID = ` + vacationID;
    const follow = await dal.execute(sql);
    return follow;
}

async function addFollow(follow) {
    const sql = `insert into follows(userID, vacationID) 
                 values('${follow.userID}', '${follow.vacationID}')`;
    return await dal.execute(sql);
};

async function deleteSpecificFollowOfUser(userID, vacationID) {
    const sql = `delete from follows where userID = ` + userID + 
                ` AND vacationID = ` + vacationID;
    await dal.execute(sql);
};

async function deleteFollow(vacationID) {
    const sql = `delete from follows where vacationID = ` + vacationID;
    await dal.execute(sql);
}

module.exports = {
    getAllFollows,
    getFollowsOfSpecificUser,
    getSpecificFollowOfSpecificUser,
    addFollow,
    deleteSpecificFollowOfUser,
    deleteFollow
}