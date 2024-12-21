import {useState} from "react";
import Plan from "../../domain/Plan.ts";
import PlanRepository from "../../repository/PlanRepository.ts";

export const usePlansUpdate = (): { updatePlans: (plans: Plan[], onSuccess: () => void) => void, loading: boolean } => {

    const repository = new PlanRepository();

    const [loading, setLoading] = useState(false);

    const updatePlans = (plans : Plan[], onSuccess: () => void) => {
        setLoading(true)
        repository.updatePlans(plans, () => {
            setLoading(false);
            onSuccess();
        });
    };

    return {updatePlans, loading};
}