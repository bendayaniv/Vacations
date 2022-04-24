export class Vacation {
    public constructor(
        public vacationID: number = 0,
        public destination: string = "",
        public description: string = "",
        public photoName: string = "",
        public start: string = "",
        public end: string = "",
        public price: string = ""
    ) {}
}