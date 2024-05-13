import Meal from "../../domain/Meal.ts";
import {useAuth} from "../useAuth.ts";
import Auth from "../../repository/Auth.ts";
import MealRepository from "../../repository/MealRepository.ts";
import {useState} from "react";

export const useMealUpdate = (onSuccess : any) : {updateMeal : (meal : Meal) => void, loading : boolean} => {

    const { auth } : { auth : Auth } = useAuth();

    const repository = new MealRepository(auth);

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