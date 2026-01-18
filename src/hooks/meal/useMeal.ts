import {MealDto} from "@elliotJHarding/meals-api";
import {useEffect, useState} from "react";
import MealRepository from "../../repository/MealRepository.ts";
import {useLocation} from "react-router-dom";

export const useMeal = (mealIdParam: string | undefined): {
    meal: MealDto | null,
    setMeal: any,
    newMeal: MealDto | null,
    setNewMeal: any,
    loading: boolean,
    failed: boolean
} => {

    const repository = new MealRepository();

    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<boolean>(false);

    const [meal, setMeal]: [meal: MealDto | null, any] = useState({
        name: "",
        description: "",
        serves: 2,
        prepTimeMinutes: 20,
        ingredients: [],
        tags: []
    });

    const [newMeal, setNewMeal]: [meal: MealDto | null, any] = useState({
        name: "",
        description: "",
        serves: 2,
        prepTimeMinutes: 20,
        ingredients: [],
        tags: []
    });


    const parseParam = (param: string | undefined): string => {
        if (param == undefined) {
            throw new Error();
        } else {
            return param;
        }
    };

    const safeParam: string = parseParam(mealIdParam);

    const {state} = useLocation();

    useEffect(() => {
        if (safeParam == 'new') {
            if (state != null) {

                const {newMeal} = state;

                if (newMeal != null) {
                    setMeal(newMeal);
                    setNewMeal(newMeal);
                }
            }

            setLoading(false);
        } else {
            const mealId = Number(safeParam);

            repository.getMeal(
                mealId,
                (fetchedMeal) => {
                    setMeal(fetchedMeal);
                    setNewMeal(fetchedMeal);
                    setLoading(false);
                },
                () => {
                    setFailed(true);
                }
            );
        }
    }, []);

    return {meal, setMeal, newMeal, setNewMeal, loading, failed};
}