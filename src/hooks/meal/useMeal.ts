import Meal from "../../domain/Meal.ts";
import {useEffect, useState} from "react";
import MealRepository from "../../repository/MealRepository.ts";
import {useLocation} from "react-router-dom";

export const useMeal = (mealIdParam : string | undefined) : {meal : Meal | null, setMeal : any, loading : boolean} => {

    const repository = new MealRepository();

    const [loading, setLoading] = useState(true);

    const [meal, setMeal] : [meal : Meal | null, any] = useState({
        name: "",
        description: "",
        serves: 2,
        prepTimeMinutes: 20,
        ingredients: []
    });

    const parseParam = (param : string | undefined) : string => {
        if (param == undefined) {
            throw new Error();
        }
        else {
            return param;
        }
    }

    const safeParam : string = parseParam(mealIdParam);

    if (safeParam == 'new') {

        const {state} = useLocation();

        useEffect(() => {
            if (state != null) {

                const {newMeal} = state;

                if (newMeal != null) {
                    setMeal(newMeal);
                }
            }

            setLoading(false);
        }, []);

    } else {

        const mealId = BigInt(safeParam);

        useEffect(() => {
            repository.getMeal(mealId, (fetchedMeal) => {
                setMeal(fetchedMeal)
                setLoading(false)
            });
        }, []);

    }

    return {meal, setMeal, loading} ;
}