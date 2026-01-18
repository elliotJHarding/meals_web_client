import {MealsApi, MealDto, Configuration} from "@harding/meals-api";
import {toastService} from "../contexts/ToastContext.tsx";
import axios from "axios";

export default class MealRepository {
    private api: MealsApi;

    constructor() {
        const configuration = new Configuration({
            basePath: import.meta.env.VITE_REPOSITORY_URL,
        });

        // Create axios instance with credentials
        const axiosInstance = axios.create({
            withCredentials: true,
        });

        this.api = new MealsApi(configuration, import.meta.env.VITE_REPOSITORY_URL, axiosInstance);
    }

    getMeals(onSuccess: (meals: MealDto[]) => void, onFailure: () => void): void {
        console.info("Fetching meals");

        this.api.getAllMeals()
            .then(response => {
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to load meals');
                onFailure();
            });
    }

    getMeal(mealId: number, onSuccess: (meal: MealDto) => void, onFailure: () => void): void {
        console.info(`Fetching meal with id: ${mealId}`);

        this.api.getMealById(mealId)
            .then(response => {
                const meal: MealDto = response.data;
                if (meal == null) {
                    console.error('No meal found in response:');
                    console.error(response);
                } else {
                    console.info('Successfully fetched meal:');
                    console.info(meal);
                    onSuccess(meal);
                }
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to load meal');
                onFailure();
            });
    }

    createMeal(meal: MealDto, onSuccess: (returnedMeal: MealDto) => void): void {
        console.info('Creating meal with values:');
        console.info(meal);

        this.api.createMeal(meal)
            .then(response => {
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to create meal');
            });
    }

    updateMeal(meal: MealDto, onSuccess: () => void): void {
        console.info('Updating meal with values:');
        console.info(meal);

        this.api.updateMeal(meal.id!, meal)
            .then(() => {
                onSuccess();
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to update meal');
            });
    }

    deleteMeal(mealId: number, onSuccess: () => void): void {
        console.info('Deleting meal with id:');
        console.info(mealId);

        this.api.deleteMeal(mealId)
            .then(() => {
                onSuccess();
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to delete meal');
            });
    }
}
