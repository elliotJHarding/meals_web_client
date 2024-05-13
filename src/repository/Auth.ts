import User from "../domain/User.ts";

export default class Auth {
    private readonly user : User;

    constructor(user : User) {
        this.user = user;
    }

    public getUser() : User {
        return this.user;
    }

    public isAuthenticated() : boolean {
        return this.user != null;
    }
}
