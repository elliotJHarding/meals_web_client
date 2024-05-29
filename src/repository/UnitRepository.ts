import {AxiosResponse} from "axios";
import {Unit} from "../domain/Unit.ts";
import ResourceRepository from "./ResourceRepository.ts";

type UnitsResponse = {
    _embedded: {
        units: Unit[]
    }
};

export default class UnitRepository extends ResourceRepository {

    getUnits(onSuccess: (units: Unit[]) => void): void {

        console.info("Fetching Units")

        this.get("units", (response: AxiosResponse) => {
            let data: UnitsResponse = response.data;
            if (data == null || data._embedded.units == null) {
                console.error(`No units found in response:`)
                console.error(response)
            } else {
                let units: Unit[] = data._embedded.units;
                console.info(`Successfully fetched units:`)
                console.info(units)
                onSuccess(units);
            }
        })
    }

}
