import { User } from "../models/user";
import { Vacation } from "../models/vacation";
import { Follow } from "../models/follow";
import { UserInfo } from "../models/userInfo";

export class AppState {
    public users: User[] = [];
    public vacations: Vacation[] = [];
    public follows: Follow[] = [];
    public loggedAdmin: User | undefined;
    public loggedUser: User | undefined;
    public userInfo: UserInfo[] = [];
}