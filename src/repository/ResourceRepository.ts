import Repository from "./Repository.ts";

export default class ResourceRepository extends Repository {

    constructor() {
        super(import.meta.env.VITE_REPOSITORY_URL);
    }

    getHeaders() {
        return {}
    }
}