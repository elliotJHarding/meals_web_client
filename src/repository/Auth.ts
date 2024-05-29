import User from "../domain/User.ts";

export default class Auth {
    private readonly user : User | null;

    constructor(user : User | null) {
        this.user = user;
    }

    public getUser() : User | null {
        return this.user;
    }

    public isAuthenticated() : boolean {
        return this.user != null;
    }
}
