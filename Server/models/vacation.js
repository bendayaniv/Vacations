class Vacation {
    constructor(vacationID, destination, description, photoName, start, end, price) {
        this.vacationID = vacationID;
        this.destination = destination;
        this.description = description;
        this.photoName = photoName;
        this.start = start;
        this.end = end;
        this.price = price;
    }
}

module.exports = Vacation;