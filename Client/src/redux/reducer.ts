import { AppState } from "./appState";
import { AnyAction } from "redux"
import { ActionType } from "./actionTypes";

export function reducer(oldAppState: AppState | undefined, action: AnyAction): AppState {

    if (!oldAppState) {
        return new AppState();
    }

    const newAppState = { ...oldAppState };

    switch (action.type) {
        case ActionType.GetAllVacations:
            newAppState.vacations = action.payload;
            break;

        case ActionType.AddVacation:
            newAppState.vacations.push(action.payload);
            break;

        case ActionType.UpdateVacation:
            for (let i = 0; i < newAppState.vacations.length; i++) {
                if (newAppState.vacations[i].vacationID === action.payload.id) {
                    newAppState.vacations[i] = action.payload;
                    break;
                }
            }
            break;

        case ActionType.DeleteVacation:
            for (let i = 0; i < newAppState.vacations.length; i++) {
                if (newAppState.vacations[i].vacationID === action.payload.id) {
                    newAppState.vacations.splice(i, 1);
                    break;
                }
            }
            break;

        case ActionType.ClearAllVacations:
            newAppState.vacations = [];
            break;

        //================================================================

        case ActionType.GetAllUsers:
            newAppState.users = action.payload;
            break;

        case ActionType.AddUser:
            newAppState.users.push(action.payload);
            break;


        case ActionType.LoggedUser:
            newAppState.loggedUser = action.payload;
            break;

        case ActionType.LoggedAdmin:
            newAppState.loggedAdmin = action.payload;
            break;

        case ActionType.LoggedOutUser:
            newAppState.loggedUser = undefined;
            break;

        case ActionType.LoggedOutAdmin:
            newAppState.loggedAdmin = undefined;
            break;

        //================================================================

        case ActionType.GetAllFollows:
            newAppState.follows = action.payload;
            break;

        case ActionType.AddFollow:
            newAppState.follows.push(action.payload);
            break;

        case ActionType.DeleteFollow:
            for (let i = 0; i < newAppState.follows.length; i++) {
                if (newAppState.follows[i].vacationID === action.payload.id) {
                    newAppState.follows.splice(i, 1);
                    break;
                }
            }
            break;


        //================================================================

        case ActionType.addUserInfo:
            newAppState.userInfo.push(action.payload);
            break;

        case ActionType.deleteUserInfo:
            for (let i = 0; i < newAppState.userInfo.length; i++) {
                if (newAppState.userInfo[i].userName === action.payload.userName) {
                    newAppState.userInfo.splice(i, 1);
                    break;
                }
            }

    }

    return newAppState;
}