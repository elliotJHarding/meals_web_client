import {MealDto} from "@harding/meals-api";
import {useEffect, useState} from "react";
import MealRepository from "../../repository/MealRepository.ts";
import { useMealsCache } from "../../contexts/MealsCacheContext.tsx";

export const useMeals = () : {meals : MealDto[], setMeals : any, loading : boolean, failed: boolean} => {

    const repository = new MealRepository();
    const { getCachedMeals, setCachedMeals, hasCachedMeals } = useMealsCache();

    const [loading, setLoading] = useState<boolean>(!hasCachedMeals());
    const [failed, setFailed] = useState<boolean>(false);

    const [meals, setMeals] : [meals : MealDto[], any] = useState(getCachedMeals());

    // Helper function to compare meals arrays
    const mealsAreEqual = (meals1: MealDto[], meals2: MealDto[]): boolean => {
        if (meals1.length !== meals2.length) return false;
        return meals1.every((meal1, index) => {
            const meal2 = meals2[index];
            return meal1.id === meal2.id &&
                   meal1.name === meal2.name &&
                   meal1.description === meal2.description;
        });
    };

    useEffect(() => {
        // If we have cached meals, use them immediately and set loading to false
        if (hasCachedMeals()) {
            setMeals(getCachedMeals());
            setLoading(false);
        }

        // Always fetch from API to ensure data is fresh
        repository.getMeals(
            (fetchedMeals) => {
                // Only update state and cache if meals have changed
                if (!mealsAreEqual(meals, fetchedMeals)) {
                    setMeals(fetchedMeals);
                    setCachedMeals(fetchedMeals);
                }
                setLoading(false);
            },
            () => {
                // Only set failed if we don't have cached meals to fall back on
                if (!hasCachedMeals()) {
                    setFailed(true);
                }
                setLoading(false);
            }
        );
    }, []);

    return {meals, setMeals, loading, failed} ;
}