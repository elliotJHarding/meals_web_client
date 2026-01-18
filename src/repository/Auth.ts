import {AppUserDto} from "@elliotJHarding/meals-api";

export default class Auth {
    private readonly user : AppUserDto | null;

    constructor(user : AppUserDto | null) {
        this.user = user;
    }

    public getUser() : AppUserDto | null {
        return this.user;
    }

    public isAuthenticated() : boolean {
        return this.user != null;
    }
}
