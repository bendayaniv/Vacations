import React, { Component } from "react";
import "./register.css";
import { User } from "../../models/user";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionTypes";
import { Unsubscribe } from "redux";
import { NavLink } from "react-router-dom";

interface RegisterState {
    users: User[];
    user: User;
    errors: {
        firstNameError: string;
        lastNameError: string;
        userNameError: string;
        passwordError: string;
    }
}

export class Register extends Component<any, RegisterState> {

    private unsubscribeStore: Unsubscribe;

    public constructor() {
        super(undefined);
        this.state = {
            users: [],
            user: new User(),
            errors: {
                firstNameError: "*",
                lastNameError: "*",
                userNameError: "*",
                passwordError: "*"
            }
        };

        this.unsubscribeStore = store.subscribe(() =>
            this.setState({
                users: store.getState().users
            }));
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public componentDidMount(): void {
        fetch("http://localhost:3001/api/users")
            .then(response => response.json())
            .then(users => {
                const action = { type: ActionType.GetAllUsers, payload: users };
                store.dispatch(action);
            })
            .catch(err => alert(err.message));
    }

    public addFirstName = (e: any): void => {
        this.setState({
            user: { ...this.state.user, firstName: e.target.value },
            errors: { ...this.state.errors, firstNameError: (e.target.value === "" ? "Missing First Name." : "") }
        });
    }

    public addLastName = (e: any): void => {
        this.setState({
            user: { ...this.state.user, lastName: e.target.value },
            errors: { ...this.state.errors, lastNameError: (e.target.value === "" ? "Missing Last Name." : "") }
        });
    }

    public addUserName = (e: any): void => {
        this.setState({
            user: { ...this.state.user, userName: e.target.value },
            errors: {
                ...this.state.errors, userNameError: e.target.value === "" ? "Missing UserName." :
                    (e.target.value.length < 4 ? "This UserName is too short." :
                        (this.state.users.find((u: User) => u.userName === e.target.value) ? "This UserName already exist." : ""))
            }
        });
    }

    public addPassword = (e: any): void => {
        this.setState({
            user: { ...this.state.user, password: e.target.value },
            errors: {
                ...this.state.errors, passwordError: e.target.value === "" ? "Missing Password." :
                    (e.target.value.length < 4 ? "This Password is too short." :
                        (this.state.users.find((u: User) => u.password === e.target.value) ? "This Password already exist." : ""))
            }
        });
    }

    public addUser = (): void => {
        fetch("http://localhost:3001/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state.user)
        })
            .then(response => response.json())
            .then(user => {
                const action = { type: ActionType.AddUser, payload: user };
                store.dispatch(action);
                this.props.history.push("/users/" + user.userID);
            })
            .catch(err => alert(err));
    };

    private isFormLegal(): boolean {
        return this.state.errors.firstNameError === "" &&
            this.state.errors.lastNameError === "" &&
            this.state.errors.userNameError === "" &&
            this.state.errors.passwordError === ""
    }

    public render(): JSX.Element {
        return (
            <div className="register">

                <h3>Here you can register to our website!</h3>

                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td><input type="text" placeholder="First Name"
                                    onChange={this.addFirstName} value={this.state.user.firstName} /></td>
                                <td><label>{this.state.errors.firstNameError}</label></td>
                            </tr>
                            <tr>
                                <td><input type="text" placeholder="Last Name"
                                    onChange={this.addLastName} value={this.state.user.lastName} /></td>
                                <td><label>{this.state.errors.lastNameError}</label></td>
                            </tr>
                            <tr>
                                <td><input type="text" placeholder="Username"
                                    onChange={this.addUserName} value={this.state.user.userName} /></td>
                                <td><label>{this.state.errors.userNameError}</label></td>
                            </tr>
                            <tr>
                                <td><input type="text" placeholder="password"
                                    onChange={this.addPassword} value={this.state.user.password} /></td>
                                <td><label>{this.state.errors.passwordError}</label></td>
                            </tr>
                            <tr>
                                <td><button disabled={!this.isFormLegal()} type="button" onClick={this.addUser}>Finish Your Register</button></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><NavLink style={{ color: 'black', fontWeight: `bolder`, fontSize: `x-large` }}
                                    to="/login" activeClassName="active-link" exact>Back to Login...</NavLink></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        );
    }
}