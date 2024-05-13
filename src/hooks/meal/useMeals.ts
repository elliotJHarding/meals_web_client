import Meal from "../../domain/Meal.ts";
import {useEffect, useState} from "react";
import {useAuth} from "../useAuth.ts";
import Auth from "../../repository/Auth.ts";
import MealRepository from "../../repository/MealRepository.ts";

export const useMeals = () : {meals : Meal[], setMeals : any, loading : boolean} => {

    const { auth } : { auth : Auth } = useAuth();

    const repository = new MealRepository(auth);

    const [loading, setLoading] = useState(true);

    const [meals, setMeals] : [meals : Meal[], any] = useState([]);

    useEffect(() => {
        repository.getMeals((fetchedMeals) => {
            setMeals(fetchedMeals)
            setLoading(false)
        });
    }, []);

    return {meals, setMeals, loading} ;
}