import React, { Component } from "react";
import "./addVacation.css";
import { Vacation } from "../../models/vacation";
import { store } from "../../redux/store";
import io from "socket.io-client";
import { Unsubscribe } from "redux";
import { NavLink } from "react-router-dom";

let socket: any;

interface AddVacationState {
    vacation: Vacation;
    vacationImage: File | null;
    errors: {
        destinationError: string,
        descriptionError: string,
        startError: string,
        endError: string,
        priceError: string
    };
}

export class AddVacation extends Component<any, AddVacationState> {

    private unsubscribeStore: Unsubscribe;

    public constructor() {
        super(undefined);
        this.state = {
            vacation: new Vacation(),
            vacationImage: null,
            errors: {
                destinationError: "*",
                descriptionError: "*",
                startError: "*",
                endError: "*",
                priceError: "*"
            }
        }

        this.unsubscribeStore = store.subscribe(
            () => { }
        );
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
        socket.disconnect();
    }

    public vacationChanges(): void {
        socket.emit("admin-made-changes");
    }

    public componentDidMount(): void {
        socket = io.connect("http://localhost:3001");
    }



    public setDestination = (e: any): void => {
        this.setState({
            vacation: { ...this.state.vacation, destination: e.target.value },
            errors: { ...this.state.errors, destinationError: e.target.value === "" ? "Missing Destination." : "" }
        })
    }

    public setDescription = (e: any): void => {
        this.setState({
            vacation: { ...this.state.vacation, description: e.target.value },
            errors: { ...this.state.errors, descriptionError: e.target.value === "" ? "Missing Description." : "" }
        })
    }

    public setPhotoName = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            vacation: { ...this.state.vacation, photoName: e.target.value },
            vacationImage: e.target.files != null ? e.target.files[0] : null
        });
    }

    public setStartDate = (e: any): void => {
        this.setState({
            vacation: { ...this.state.vacation, start: e.target.value },
            errors: { ...this.state.errors, startError: e.target.value === "" ? "Missing Start Date." : "" }
        })
    }

    public setEndDate = (e: any): void => {
        this.setState({
            vacation: { ...this.state.vacation, end: e.target.value },
            errors: { ...this.state.errors, endError: e.target.value === "" ? "Missing End Date." : "" }
        })
    }

    public setPrice = (e: any): void => {
        this.setState({
            vacation: { ...this.state.vacation, price: e.target.value },
            errors: { ...this.state.errors, priceError: e.target.value === "" ? "Missing Price." : "" }
        })
    }

    public addVacation = async (): Promise<void> => {
        try {
            const vacationPhotoName = await this.uploadVacationPhoto();
            this.state.vacation.photoName = vacationPhotoName;
            await this.postVacation();
        }
        catch (err) {
            alert(err.message);
        }
    }

    public postVacation = (): void => {
        fetch("http://localhost:3001/api/vacations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state.vacation)
        })
            .then(response => {
                response.json();
                this.vacationChanges();
                this.props.history.push("/adminVacations");
            })
            // .then(vacation => {
            //     console.log(vacation);
            //     this.vacationChanges();
            //     this.props.history.push("/adminVacations");
            // })
            .catch(err => alert(err.message));
    }

    private isFormLegal(): boolean {
        return this.state.errors.destinationError === "" &&
            this.state.errors.descriptionError === "" &&
            this.state.errors.startError === "" &&
            this.state.errors.endError === "" &&
            this.state.errors.priceError === ""
    }

    public uploadVacationPhoto = (): Promise<string> => {
        const formData = new FormData();

        formData.append(
            "vacationImage",
            (this.state.vacationImage as File),
            (this.state.vacationImage as File).name
        );

        return fetch("http://localhost:3001/api/vacationImage/", {
            method: "POST",
            body: formData
        })
            .then(response => response.text());
    }

    public render(): JSX.Element {
        return (
            <div className="add-vacation">

                <form action="/upload-image" method="POST" encType="multipart/form-data">
                    <table>
                        <tbody>
                            <tr>
                                <td><input type="text" placeholder="Destination..."
                                    onChange={this.setDestination} value={this.state.vacation.destination} /></td>
                                <td><label>{this.state.errors.destinationError}</label></td>
                            </tr>
                            <tr>
                                <td><textarea onChange={this.setDescription} value={this.state.vacation.description}>Description...</textarea></td>
                                <td><label>{this.state.errors.descriptionError}</label></td>
                            </tr>
                            <tr>
                                <td><input type="file" accept="image/*" name="vacationImage"
                                    onChange={this.setPhotoName} value={this.state.vacation.photoName} /></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><input type="date" onChange={this.setStartDate} value={this.state.vacation.start} /></td>
                                <td><label>{this.state.errors.startError}</label></td>
                            </tr>
                            <tr>
                                <td><input type="date" onChange={this.setEndDate} value={this.state.vacation.end} /></td>
                                <td><label>{this.state.errors.endError}</label></td>
                            </tr>
                            <tr>
                                <td><input type="text" placeholder="Price..."
                                    onChange={this.setPrice} value={this.state.vacation.price} /></td>
                                <td><label>{this.state.errors.priceError}</label></td>
                            </tr>
                            <tr>
                                <td><button disabled={!this.isFormLegal()} type="button" onClick={this.addVacation}>Add Vacation</button></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><NavLink style={{ color: 'black', fontWeight: `bolder`, fontSize: `x-large` }}
                                    to="/adminVacations" activeClassName="active-link" exact>Back to vacations</NavLink></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        );
    }
}