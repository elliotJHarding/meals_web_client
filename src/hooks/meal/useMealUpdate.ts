import {MealDto} from "@harding/meals-api";
import MealRepository from "../../repository/MealRepository.ts";
import {useState} from "react";

export const useMealUpdate = (onSuccess: any): {updateMeal: (meal: MealDto) => void, loading: boolean} => {

    const repository = new MealRepository();

    const [loading, setLoading] = useState(false);

    const updateMeal = (meal: MealDto) => {
        setLoading(true);
        repository.updateMeal(meal, () => {
            setLoading(false);
            onSuccess();
        });
    };

    return {updateMeal, loading};
}