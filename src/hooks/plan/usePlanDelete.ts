import {useState} from "react";
import Plan from "../../domain/Plan.ts";
import PlanRepository from "../../repository/PlanRepository.ts";

export const usePlanDelete= (): { deletePlan: (plan: Plan, onSuccess: () => void) => void, loading: boolean } => {

    const repository = new PlanRepository();

    const [loading, setLoading] = useState(false);

    const deletePlan = (plan : Plan, onSuccess: () => void) => {
        setLoading(true)
        repository.deletePlan(plan, () => {
            setLoading(false);
            onSuccess();
        });
    };

    return {deletePlan, loading};
}