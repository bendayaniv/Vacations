import React, { Component } from "react";
import "./editVacation.css";
import { Vacation } from "../../models/vacation";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import io from "socket.io-client";
import { NavLink } from "react-router-dom";

let socket: any;

interface EditVacationState {
    vacations: Vacation[];
    vacation: Vacation;
}

export class EditVacation extends Component<any, EditVacationState> {

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: store.getState().vacations,
            vacation: new Vacation()
        };

        this.unsubscribeStore = store.subscribe(() =>
            this.setState({
                vacations: store.getState().vacations
            }));
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

        const id = +this.props.match.params.vacationID;

        let vacation = store.getState().vacations.find((v: Vacation) => v.vacationID === id);
        if (!vacation) {
            vacation = new Vacation();
        }
        this.setState({ vacation });
    }

    public changeDescription = (e: any): void => {
        this.setState({ vacation: { ...this.state.vacation, description: e.target.value } })
    }

    public changeStartDate = (e: any): void => {
        this.setState({ vacation: { ...this.state.vacation, start: e.target.value } })
    }

    public changeEndDate = (e: any): void => {
        this.setState({ vacation: { ...this.state.vacation, end: e.target.value } })
    }

    public changePrice = (e: any): void => {
        this.setState({ vacation: { ...this.state.vacation, price: e.target.value } })
    }

    public changeVacation = (id: number): void => {
        fetch("http://localhost:3001/api/vacations/" + id, {
            method: "PATCH",
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
            .catch(err => {
                alert(err);
            });
    }

    public render(): JSX.Element {
        return (
            <div className="edit-vacation">

                <h1>Edit Vacation to {this.state.vacation.destination} (Number {this.state.vacation.vacationID})</h1>

                <form>
                    <textarea onChange={this.changeDescription} value={this.state.vacation.description}>{this.state.vacation.description}</textarea>

                    <br />

                    <input type="date" placeholder={this.state.vacation.start}
                        onChange={this.changeStartDate} value={this.state.vacation.start} />

                    <br />

                    <input type="date" placeholder={this.state.vacation.end}
                        onChange={this.changeEndDate} value={this.state.vacation.end} />

                    <br />

                    <input type="text" placeholder={this.state.vacation.price}
                        onChange={this.changePrice} value={this.state.vacation.price} />

                    <br />

                    <button type="button" onClick={() => { this.changeVacation(this.state.vacation.vacationID) }}>Save Changes</button>

                    <br />

                    <NavLink style={{ color: 'black', fontWeight: `bolder`, fontSize: `x-large` }}
                        to="/adminVacations" activeClassName="active-link" exact>Back to vacations</NavLink>
                </form>

            </div>
        );
    }
}