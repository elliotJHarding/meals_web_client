import PlanRepository from "../../repository/PlanRepository.ts";
import {useEffect, useState} from "react";
import MealPlan from "../../domain/MealPlan.ts";

export const usePlans = (start : Date, end : Date) => {
    const repository = new PlanRepository();

    const [mealPlan, setMealPlan] = useState<MealPlan>(new MealPlan([]))

    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<boolean>(false);

    useEffect(() =>
        repository.getPlans(
            start, end,
            (plans) => {
                setLoading(false);
                setMealPlan(new MealPlan(plans));
            },
            () => {
                setFailed(true);
                setLoading(false);
            })
    ,[])

    return {mealPlan, setMealPlan, loading, failed}
}