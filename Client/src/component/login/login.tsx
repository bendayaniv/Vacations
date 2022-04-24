import React, { Component } from "react";
import "./login.css";
import { User } from "../../models/user";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionTypes";
import { NavLink } from "react-router-dom";
import { UserInfo } from "../../models/userInfo";

interface LoginState {
    users: User[];
    user: User;
    userName: string;
    password: string;
    userNameRef: React.RefObject<HTMLInputElement>;
    passwordRef: React.RefObject<HTMLInputElement>;
    errors: {
        userNameError: string;
        passwordError: string;
    };
}

export class Login extends Component<any, LoginState> {

    private unsubscribeStore: Unsubscribe;

    public constructor() {
        super(undefined);
        this.state = {
            users: store.getState().users,
            user: new User(),
            userName: "",
            password: "",
            userNameRef: React.createRef(),
            passwordRef: React.createRef(),
            errors: {
                userNameError: "",
                passwordError: ""
            },
        }

        this.unsubscribeStore = store.subscribe(() =>
            this.setState({
                users: store.getState().users,
            }));
    }

    public componentDidMount(): void {
        fetch("http://localhost:3001/api/users")
            .then(response => response.json())
            .then(users => {
                const action = { type: ActionType.GetAllUsers, payload: users };
                store.dispatch(action);
            })
            .catch(err => alert(err));
    }

    private setUserName = (e: any): void => {
        this.setState({
            userName: e.target.value,
            errors: { ...this.state.errors, userNameError: (e.target.value === "" ? "Missing UserName." : "") }
        })
    }

    private setPassword = (e: any): void => {
        this.setState({
            password: e.target.value,
            errors: { ...this.state.errors, passwordError: (e.target.value === "" ? "Missing Password." : "") }
        });
    }

    public setSignIn = (): void => {

        let valueUserName = this.state.userName;
        let valuePassword = this.state.password;

        if (valueUserName === "" || valuePassword === "") {
            alert("Username or Password are missing.");
        }
        else {

            let userInfo: UserInfo = {
                userName: valueUserName
            }

            if (valueUserName === "bendayaniv" && valuePassword === "12345Ybd") {
                const action = { type: ActionType.LoggedAdmin, payload: valueUserName };
                store.dispatch(action);
                localStorage.setItem("adminInfo", JSON.stringify(userInfo));
                this.props.history.push("/adminVacations");
            }
            else {
                for (let i = 0; i < this.state.users.length; i++) {
                    if (this.state.users[i].userName === valueUserName && this.state.users[i].password === valuePassword) {
                        alert("Welcome");
                        const action = { type: ActionType.LoggedUser, payload: this.state.users[i] };
                        store.dispatch(action);
                        localStorage.setItem("userInfo", JSON.stringify(userInfo));
                        this.props.history.push("/users/" + this.state.users[i].userID);
                        return;
                    }
                }
                alert("Your UserName or your Password are wrong. Try again.");
                this.setState({ userName: "", password: "" });
            }
        }
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public render(): JSX.Element {
        return (
            <div className="login">

                <h1>Welcome!!</h1>

                <br />

                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td><input type="text" placeholder="Username"
                                    onChange={this.setUserName} value={this.state.userName} /></td>
                                <td><label>{this.state.errors.userNameError}</label></td>
                            </tr>
                            <tr>
                                <td><input type="password" placeholder="Password"
                                    onChange={this.setPassword} value={this.state.password} /></td>
                                <td><label>{this.state.errors.passwordError}</label></td>
                            </tr>
                            <tr>
                                <td><button type="button" onClick={this.setSignIn}>Login</button></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td className="nav-link"><NavLink style={{ color: 'black', fontWeight: `bolder`, fontSize: `x-large` }}
                                    to="/register" activeClassName="active-link" exact>New User? Join Now!</NavLink></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        );
    }
}