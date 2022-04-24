import React, { Component } from "react";
import "./adminVacations.css";
import { Vacation } from "../../models/vacation";
import { ActionType } from "../../redux/actionTypes";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import io from "socket.io-client";
import { NavLink } from "react-router-dom";

let socket: any;

interface AdminVacationsState {
    vacations: Vacation[];
    admin: any;
    imgRef: React.RefObject<HTMLImageElement>;
    adminInfo: {
        adminUserName: string;
    };
}

export class AdminVacations extends Component<any, AdminVacationsState> {

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: store.getState().vacations,
            admin: store.getState().loggedAdmin,
            imgRef: React.createRef(),
            adminInfo: {
                adminUserName: ""
            }
        };

        this.unsubscribeStore = store.subscribe(() =>
            this.setState({
                vacations: store.getState().vacations,
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
        socket.on("admin-made-changes", (vacations: Vacation[]): void => {
            const action = { type: ActionType.GetAllVacations, payload: vacations };
            store.dispatch(action);
        })
        fetch("http://localhost:3001/api/vacations")
            .then(response => response.json())
            .then(vacations => {
                const action = { type: ActionType.GetAllVacations, payload: vacations };
                store.dispatch(action);
            })
            .catch(err => alert(err));

        let lastUser = localStorage.getItem("adminInfo");
        if (lastUser != null) {
            let currentUser = JSON.parse(lastUser);
            const adminInfo = { ...this.state.adminInfo };
            adminInfo.adminUserName = currentUser.userName;
            this.setState({ adminInfo: adminInfo });
        }
    }

    public logOut = (): void => {
        const action = { type: ActionType.LoggedOutAdmin, payload: undefined };
        store.dispatch(action);
        localStorage.removeItem("adminInfo");
    }

    public goEditVacation = (id: number): void => {
        this.props.history.push("/adminVacations/editVacation/" + id);
    }

    private deleteVacation = (id: number): void => {
        if (window.confirm("Are You Sure You Want To Delete This Vacation?") === true) {

            fetch("http://localhost:3001/api/follows/" + id, {
                method: "DELETE",
            })
                .then(response => {
                    console.log(response);
                    this.vacationChanges();
                })
                .catch(err => alert(err.message));

            fetch("http://localhost:3001/api/vacations/" + id, {
                method: "DELETE",
            })
                .then(response => {
                    console.log(response);
                    const action = { type: ActionType.DeleteVacation, payload: this.state.vacations };
                    store.dispatch(action);
                    this.vacationChanges();
                })
                .catch(err => alert(err.message));
        }
    }

    public render(): JSX.Element {
        return (
            <div className="admin-vacations">

                <h1>Hello Admin {this.state.adminInfo.adminUserName}</h1>

                <h4>Now there is {this.state.vacations.length} vacations available!</h4>

                <br />

                <div className="nav-link">
                    <NavLink style={{ color: 'black', fontWeight: `bolder`, fontSize: `x-large` }}
                        to="/login" activeClassName="active-link" onClick={this.logOut} exact>Log Out</NavLink>
                    <span> | </span>
                    <NavLink style={{ color: 'black', fontWeight: `bolder`, fontSize: `x-large` }}
                        to="/adminVacations/newVacation" activeClassName="active-link" exact>Add Vacation</NavLink>
                </div>

                <br />

                {this.state.vacations.map(v =>
                    <div key={v.vacationID} className="vacations-cards">
                        <img alt="edit" src={"/assets/images/icons8-edit.svg"} id="edit-vacation-button" onClick={() => { this.goEditVacation(v.vacationID) }} />
                        <button id="delete-vacation-button" type="button" onClick={() => { this.deleteVacation(v.vacationID) }}>X</button>
                        <img src={"http://localhost:3001/assets/images/" + v.photoName} ref={this.state.imgRef} alt={v.photoName} />
                        <h3 className="centered">{v.destination}</h3>
                        <p>{v.description}</p>
                        <p>{v.start}</p>
                        <p>{v.end}</p>
                        <p>{v.price}</p>
                    </div>
                )}

                <br />

            </div>
        );
    }
}