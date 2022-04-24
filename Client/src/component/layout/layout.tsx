import React, { Component } from "react";
import "./layout.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Login } from "../login/login";
import { Register } from "../register/register";
import { AdminVacations } from "../adminVacations/adminVacations";
import { EditVacation } from "../editVacation/editVacation";
import { AddVacation } from "../addVacation/addVacation";
import { UserVacations } from "../userVacations/userVacations";

export class Layout extends Component {
    public render(): JSX.Element {
        return (
            <div className="layout">
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" component={Login} exact />
                        <Route path="/register" component={Register} exact />
                        <Route path="/adminVacations" component={AdminVacations} exact />
                        <Route path="/adminVacations/editVacation/:vacationID" component={EditVacation} exact />
                        <Route path="/adminVacations/newVacation" component={AddVacation} exact />
                        <Route path="/users/:userID" component={UserVacations} exact />
                        <Redirect from="/" to="/login" exact />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}