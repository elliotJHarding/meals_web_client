import Meal from "../../domain/Meal.ts";
import {useAuth} from "../useAuth.ts";
import Auth from "../../repository/Auth.ts";
import MealRepository from "../../repository/MealRepository.ts";
import {useState} from "react";

export const useMealCreate = (onSuccess : (createdMeal: Meal) => void) : {createMeal : (meal : Meal) => void, loading : boolean, createdMeal: Meal | null} => {

    const { auth } : { auth : Auth } = useAuth();

    const repository = new MealRepository(auth);

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