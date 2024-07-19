import {useState} from "react";
import Plan from "../../domain/Plan.ts";
import PlanRepository from "../../repository/PlanRepository.ts";

export const usePlanUpdate = (): { updatePlan: (plan: Plan, onSuccess: () => void) => void, loading: boolean } => {

    const repository = new PlanRepository();

    const [loading, setLoading] = useState(false);

    const updatePlan = (plan : Plan, onSuccess: () => void) => {
        setLoading(true)
        repository.updatePlan(plan, () => {
            setLoading(false);
            onSuccess();
        });
    };

    return {updatePlan, loading};
}