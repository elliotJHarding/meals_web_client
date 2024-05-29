import Meal from "../../domain/Meal.ts";
import MealRepository from "../../repository/MealRepository.ts";
import {useState} from "react";

export const useMealUpdate = (onSuccess : any) : {updateMeal : (meal : Meal) => void, loading : boolean} => {

    const repository = new MealRepository();

    const [loading, setLoading] = useState(false);

    const updateMeal = (meal : Meal) => {
        setLoading(true)
        repository.updateMeal(meal, () => {
            setLoading(false);
            onSuccess();
        });
    };

    return {updateMeal, loading};
}