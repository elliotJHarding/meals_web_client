import PlanRepository from "../../repository/PlanRepository.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import MealPlan from "../../domain/MealPlan.ts";

export const usePlans = (start: Date, end: Date) => {
    const repository = useRef(new PlanRepository()).current;

    const [mealPlan, setMealPlan] = useState<MealPlan>(new MealPlan([]));

    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<boolean>(false);

    const startRef = useRef(start);
    const endRef = useRef(end);

    const fetchPlans = useCallback(() => {
        repository.getPlans(
            startRef.current, endRef.current,
            (plans) => {
                setLoading(false);
                setMealPlan(new MealPlan(plans));
            },
            () => {
                setFailed(true);
                setLoading(false);
            });
    }, [repository]);

    useEffect(() => fetchPlans(), []);

    return {mealPlan, setMealPlan, loading, failed, refetch: fetchPlans};
}
