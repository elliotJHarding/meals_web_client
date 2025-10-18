import {AxiosResponse} from "axios";
import Meal from "../domain/Meal.ts";
import ResourceRepository from "./ResourceRepository.ts";

export default class MealRepository extends ResourceRepository {

    getMeals(onSuccess : (meals : Meal[]) => void, onFailure : () => void) : void {
        console.info("Fetching meals")

        this.get(
            "meals",
            (response : AxiosResponse) => {
                onSuccess(response.data);
            },
            // @ts-ignore
            (response : AxiosResponse) => {
                onFailure();
            }
        )
    }

    getMeal(mealId : bigint, onSuccess : (meal : Meal) => void, onFailure : () => void) : void {
        console.info(`Fetching meal with id: ${mealId}`)

        this.get(
            `meals/${mealId}`,
            (response: AxiosResponse) => {
                let meal : Meal = response.data;
                if (meal == null) {
                    console.error('No meal found in response:')
                    console.error(response)
                } else {
                    console.info('Successfully fetched meal:')
                    console.info(meal)
                    onSuccess(meal);
                }
            },
            // @ts-ignore
            (error: AxiosResponse) => {
                onFailure();
            }
        )
    }

    createMeal(meal: Meal, onSuccess : (returnedMeal: Meal) => void) : void {
        console.info('Creating meal with values:');
        console.info(meal)

        this.post(`meals`, meal, (response: AxiosResponse) => onSuccess(response.data));
    }

    updateMeal(meal: Meal, onSuccess : () => void) : void {
        console.info('Updating meal with values:');
        console.info(meal)

        this.update(`meals/${meal.id}`, meal,() => onSuccess());
    }

    deleteMeal(mealId: bigint, onSuccess : () => void) : void {
        console.info('Deleting meal with id:');
        console.info(mealId)

        this.delete(`meals/${mealId}`, () => onSuccess());
    }
}
