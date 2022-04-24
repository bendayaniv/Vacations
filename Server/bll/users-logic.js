const dal = require("../dal/dal");

async function getAllUsers() {
    const sql = `select userID, firstName, lastName, userName, password from users`;
    const users = await dal.execute(sql);
    return users;
}

async function getOneUser(id) {
    const sql = `select userID, firstName, lastName, userName, password from users where userID = ` +id;
    const user = await dal.execute(sql);
    return user[0];
}

async function addUser(user) {
    const sql = `insert into users(firstName, lastName, userName, password) 
                values('${user.firstName}', '${user.lastName}',
                 '${user.userName}', '${user.password}')`;
    const info = await dal.execute(sql);
    user.userID = info.insertId;
    return user;
}

async function updateUser(user) {
    const sql = `update users set firstName = '${user.firstName}', lastName = '${user.lastName}',
                 userName = '${user.userName}', password = '${user.password}' where userID = '${user.userID}'`;
    await dal.execute(sql);
    return user;
}

async function deleteUser(id) {
    const sql = `delete from users where userID = ` + id;
    await dal.execute(sql);
}

module.exports = {
    getAllUsers,
    getOneUser,
    addUser,
    updateUser,
    deleteUser
}