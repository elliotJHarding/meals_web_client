import Repository from "./Repository.ts";
import Auth from "./Auth.ts";


export default class ResourceRepository extends Repository {

    protected readonly auth : Auth;

    constructor(authContext : Auth) {
        super(import.meta.env.VITE_REPOSITORY_URL);
        this.auth = authContext;
    }

    getHeaders() {
        return {}
    }
}