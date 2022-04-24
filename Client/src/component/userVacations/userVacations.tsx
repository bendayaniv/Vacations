import React, { Component } from "react";
import "./userVacations.css";
import { Vacation } from "../../models/vacation";
import { Follow } from "../../models/follow";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import { NavLink } from "react-router-dom";
import io from "socket.io-client";
import { ActionType } from "../../redux/actionTypes";

let socket: any;

interface UserVacationsState {
    user: any;
    vacations: Vacation[];
    follows: Follow[];
    follow: Follow;
    imgRef: React.RefObject<HTMLImageElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    userInfo: {
        userName: string;
    };
    userIdStorage: {
        userId: number;
    }
}

export class UserVacations extends Component<any, UserVacationsState> {

    private unsubscribeStore: Unsubscribe;

    public constructor() {
        super(undefined);
        this.state = {
            user: store.getState().loggedUser,
            vacations: store.getState().vacations,
            follows: store.getState().follows,
            follow: new Follow(),
            imgRef: React.createRef(),
            inputRef: React.createRef(),
            userInfo: {
                userName: ""
            },
            userIdStorage: {
                userId: 0
            }
        };

        this.unsubscribeStore = store.subscribe(() =>
            this.setState({
                user: store.getState().loggedUser,
                vacations: store.getState().vacations,
                follows: store.getState().follows
            }));
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
        if (socket) {
            socket.disconnect();
        }

    }

    public followChanges(): void {
        socket.emit("user-made-changes");
    }

    public componentDidMount(): void {
        console.log(this.state.user);
        socket = io.connect("http://localhost:3001");
        socket.on("admin-made-changes", (vacations: Vacation[]): void => {
            const action = { type: ActionType.GetAllVacations, payload: vacations };
            store.dispatch(action);
        });
        socket.on("user-made-changes", (follows: Follow[]): void => {
            const action = { type: ActionType.GetAllFollows, payload: follows };
            store.dispatch(action);
        })

        const id = +this.props.match.params.userID;

        fetch("http://localhost:3001/api/vacations")
            .then(response => response.json())
            .then(vacations => {
                const action = { type: ActionType.GetAllVacations, payload: vacations };
                store.dispatch(action);
            })
            .catch(err => alert(err.message));

        fetch("http://localhost:3001/api/follows")
            .then(response => response.json())
            .then(follows => {
                const action = { type: ActionType.GetAllFollows, payload: follows };
                store.dispatch(action);
            })
            .catch(err => alert(err.message));

        localStorage.setItem("userId", JSON.stringify(id));

        let lastUserId = localStorage.getItem("userId");
        if (lastUserId != null) {
            const userIdStorage = { ...this.state.userIdStorage };
            let currentUserId = JSON.parse(lastUserId);
            userIdStorage.userId = currentUserId;
            console.log(userIdStorage.userId);
            this.setState({ userIdStorage: userIdStorage });
        }

        let lastUserName = localStorage.getItem("userInfo");
        if (lastUserName != null) {
            const userInfo = { ...this.state.userInfo };
            let currentUser = JSON.parse(lastUserName);
            userInfo.userName = currentUser.userName;
            console.log(userInfo.userName);
            this.setState({ userInfo: userInfo });
        }
    }

    public logOut = (): void => {
        const action = { type: ActionType.LoggedOutUser, payload: undefined };
        store.dispatch(action);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userId");
    }

    public followVacation = (id: number): void => {
        const userID = +this.props.match.params.userID;
        const vacationID = id;
        const follow = { ...this.state.follow };
        follow.userID = userID;
        follow.vacationID = vacationID;
        this.setState({ follow });
        fetch("http://localhost:3001/api/follows", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(follow)
        })
            .then(response => response.json())
            .then(follow => {
                const action = { type: ActionType.AddFollow, payload: follow };
                store.dispatch(action);
                this.followChanges();
            })
            .catch(err => alert(err.message));
    }

    public unfollowVacation = (id: number): void => {
        const userID = +this.props.match.params.userID;
        const vacationID = id;
        fetch("http://localhost:3001/api/follows/" + userID + "/" + vacationID, {
            method: "DELETE"
        })
            .then(response => {
                console.log(response);
                this.followChanges();
            })
            .catch(err => alert(err.message));
    }

    public render(): JSX.Element {
        return (
            <div className="user-vacations">

                <h1>Hello {this.state.userInfo.userName}</h1>

                <h4>Now there is {this.state.vacations.length} vacations available!</h4>

                <br />
                
                <div className="nav-link">
                    <NavLink style={{ color: 'black', fontWeight: `bolder`, fontSize: `x-large` }}
                        to="/login" activeClassName="active-link" onClick={this.logOut} exact>Sign Out</NavLink>
                </div>

                <br />

                {this.state.vacations.map(v =>
                    <div
                        style={{ display: (this.state.follows.find(f => f.vacationID === v.vacationID && f.userID === this.state.userIdStorage.userId) ? "" : "none") }}
                        key={v.vacationID} className="vacations-cards">
                        <button id="unfollow-button" type="button" onClick={() => { this.unfollowVacation(v.vacationID) }}>Unfollow Me</button>
                        <img src={"http://localhost:3001/assets/images/" + v.photoName} ref={this.state.imgRef} alt={v.photoName} />
                        <div className="centered">{v.destination}</div>
                        <p>{v.description}</p>
                        <p>Start at: {v.start}</p>
                        <p>End at: {v.end}</p>
                        <p>{v.price}</p>
                    </div>
                )}

                {this.state.vacations.map(v =>
                    <div
                        style={{ display: (this.state.follows.find(f => f.vacationID === v.vacationID && f.userID === this.state.userIdStorage.userId) ? "none" : "") }}
                        key={v.vacationID} className="vacations-cards">
                        <button id="follow-button" type="button" onClick={() => { this.followVacation(v.vacationID) }}>Follow Me</button>
                        <img src={"http://localhost:3001/assets/images/" + v.photoName} ref={this.state.imgRef} alt={v.photoName} />
                        <div className="centered">{v.destination}</div>
                        <p>{v.description}</p>
                        <p>Start at: {v.start}</p>
                        <p>End at: {v.end}</p>
                        <p>{v.price}</p>
                    </div>
                )}

            </div>
        );
    }
}