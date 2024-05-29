import Meal from "../../domain/Meal.ts";
import MealRepository from "../../repository/MealRepository.ts";
import {useState} from "react";

export const useMealCreate = (onSuccess : (createdMeal: Meal) => void) : {createMeal : (meal : Meal) => void, loading : boolean} => {

    const repository = new MealRepository();

    const [loading, setLoading] = useState<boolean>(false);

    const createMeal = (meal : Meal) => {
        setLoading(true)
        repository.createMeal(meal, (createdMeal: Meal) => {
            setLoading(false);
            onSuccess(createdMeal);
        });
    };

    return {createMeal, loading};
}