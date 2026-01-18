import {TagsApi, MealTag, Configuration} from "@harding/meals-api";
import {toastService} from "../contexts/ToastContext.tsx";
import axios from "axios";

export default class MealTagRepository {
    private api: TagsApi;

    constructor() {
        const configuration = new Configuration({
            basePath: import.meta.env.VITE_REPOSITORY_URL,
        });

        const axiosInstance = axios.create({
            withCredentials: true,
        });

        this.api = new TagsApi(configuration, import.meta.env.VITE_REPOSITORY_URL, axiosInstance);
    }

    getTags(onSuccess: (tags: MealTag[]) => void): void {
        console.info("Fetching tags");

        this.api.getAllTags()
            .then(response => {
                console.info("Successfully fetched tags");
                console.info(response.data);
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to load tags');
            });
    }
}