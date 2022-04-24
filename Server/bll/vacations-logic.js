const dal = require("../dal/dal");

async function getAllVacations() {
    const sql = `select vacationID, destination, description, photoName, start, end, price from vacations`;
    const vacations = await dal.execute(sql);
    return vacations;
};

async function getOneVacation(id) {
    const sql = `select vacationID, destination, description, photoName, start, end, price 
                 from vacations where vacationID = ` + id;
    const vacation = await dal.execute(sql);
    return vacation[0];
};

async function addVacation(vacation) {
    const sql = `insert into vacations(destination, description, photoName, start, end, 
                 price) values('${vacation.destination}', '${vacation.description}', 
                 '${vacation.photoName}', '${vacation.start}', 
                 '${vacation.end}', '${vacation.price}')`;
    const info = await dal.execute(sql);
    vacation.vacationID = info.insertId;
    return vacation;
};

async function updatePartialVacation(vacation) {
    const sql = `update vacations set description = '${vacation.description}', start = '${vacation.start}', 
                 end = '${vacation.end}', price = '${vacation.price}' where vacationID = '${vacation.vacationID}'`;
    await dal.execute(sql);
    return vacation;
};

async function delelteVacation(id) {
    const sql = `delete from vacations where vacationID = ` + id;
    await dal.execute(sql);
};

module.exports = {
    getAllVacations,
    getOneVacation,
    addVacation,
    updatePartialVacation,
    delelteVacation
}