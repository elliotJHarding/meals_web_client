import {useState} from "react";
import {PlanDto} from "@harding/meals-api";
import PlanRepository from "../../repository/PlanRepository.ts";

export const usePlanUpdate = (): {updatePlan: (plan: PlanDto, onSuccess: () => void) => void, loading: boolean} => {

    const repository = new PlanRepository();

    const [loading, setLoading] = useState(false);

    const updatePlan = (plan: PlanDto, onSuccess: () => void) => {
        setLoading(true);
        repository.updatePlan(plan, () => {
            setLoading(false);
            onSuccess();
        });
    };

    return {updatePlan, loading};
}