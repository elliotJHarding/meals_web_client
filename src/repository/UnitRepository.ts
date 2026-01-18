import {UnitsApi, UnitDto, Configuration, UnitsResponse} from "@harding/meals-api";
import {toastService} from "../contexts/ToastContext.tsx";
import axios from "axios";

export default class UnitRepository {
    private api: UnitsApi;

    constructor() {
        const configuration = new Configuration({
            basePath: import.meta.env.VITE_REPOSITORY_URL,
        });

        const axiosInstance = axios.create({
            withCredentials: true,
        });

        this.api = new UnitsApi(configuration, import.meta.env.VITE_REPOSITORY_URL, axiosInstance);
    }

    getUnits(onSuccess: (units: UnitDto[]) => void): void {
        console.info("Fetching Units");

        this.api.getUnits()
            .then(response => {
                let data: UnitsResponse = response.data;
                if (data == null || data._embedded?.units == null) {
                    console.error(`No units found in response:`);
                    console.error(response);
                } else {
                    let units: UnitDto[] = data._embedded.units;
                    console.info(`Successfully fetched units:`);
                    console.info(units);
                    onSuccess(units);
                }
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to load units');
            });
    }
}
