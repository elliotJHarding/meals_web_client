import {MealDto} from "@elliotJHarding/meals-api";
import MealRepository from "../../repository/MealRepository.ts";
import {useState} from "react";

export const useMealCreate = (onSuccess: (createdMeal: MealDto) => void): {createMeal: (meal: MealDto) => void, loading: boolean} => {

    const repository = new MealRepository();

    const [loading, setLoading] = useState<boolean>(false);

    const createMeal = (meal: MealDto) => {
        setLoading(true);
        repository.createMeal(meal, (createdMeal: MealDto) => {
            setLoading(false);
            onSuccess(createdMeal);
        });
    };

    return {createMeal, loading};
}