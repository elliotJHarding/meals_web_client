import ResourceRepository from "./ResourceRepository.ts";
import {AxiosResponse} from "axios";
import MealTag from "../domain/MealTag.ts";

export default class MealTagRepository extends ResourceRepository {

    getTags(onSuccess : (tags : MealTag[]) => void) : void {
        console.info("Fetching meals")

        this.get(
            "tags",
            (response : AxiosResponse) => {
                onSuccess(response.data);
            }
        )
    }

}