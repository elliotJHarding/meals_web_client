import Meal from "../../domain/Meal.ts";
import {useEffect, useState} from "react";
import MealRepository from "../../repository/MealRepository.ts";

export const useMeals = () : {meals : Meal[], setMeals : any, loading : boolean, failed: boolean} => {

    const repository = new MealRepository();

    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<boolean>(false);

    const [meals, setMeals] : [meals : Meal[], any] = useState([]);

    useEffect(() => {
        repository.getMeals(
            (fetchedMeals) => {
                setMeals(fetchedMeals)
                setLoading(false)
            },
            () => {
                setFailed(true);
            }
        );
    }, []);

    return {meals, setMeals, loading, failed} ;
}