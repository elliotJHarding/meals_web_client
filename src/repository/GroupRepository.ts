import {FamilyGroupApi, FamilyGroupDto, Configuration} from "@harding/meals-api";
import {toastService} from "../contexts/ToastContext.tsx";
import axios from "axios";

export default class GroupRepository {
    private api: FamilyGroupApi;

    constructor() {
        const configuration = new Configuration({
            basePath: import.meta.env.VITE_REPOSITORY_URL,
        });

        const axiosInstance = axios.create({
            withCredentials: true,
        });

        this.api = new FamilyGroupApi(configuration, import.meta.env.VITE_REPOSITORY_URL, axiosInstance);
    }

    getGroup(onSuccess: (group: FamilyGroupDto) => void, onFailure: () => void): void {
        console.info("Fetching Group");

        this.api.getFamilyGroup()
            .then(response => {
                console.info("Successfully fetched family group");
                console.info(response.data);
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to load family group');
                onFailure();
            });
    }

    createGroup(onSuccess: (id: string) => void): void {
        console.info("Creating Group");

        this.api.createFamilyGroup()
            .then(response => {
                console.info("Successfully created family group");
                toastService.showSuccess('Family group created');
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to create family group');
            });
    }

    joinGroup(uuid: string, onSuccess: () => void, onFailure: () => void): void {
        console.info("Joining Group", uuid);

        this.api.joinFamilyGroup(uuid)
            .then(() => {
                console.info("Successfully joined family group");
                toastService.showSuccess('Joined family group');
                onSuccess();
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to join family group');
                onFailure();
            });
    }
}
