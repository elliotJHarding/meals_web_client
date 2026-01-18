import {useState} from "react";
import {PlanDto} from "@elliotJHarding/meals-api";
import PlanRepository from "../../repository/PlanRepository.ts";

export const usePlansUpdate = (): {updatePlans: (plans: PlanDto[], onSuccess: () => void) => void, loading: boolean} => {

    const repository = new PlanRepository();

    const [loading, setLoading] = useState(false);

    const updatePlans = (plans: PlanDto[], onSuccess: () => void) => {
        setLoading(true);
        repository.updatePlans(plans, () => {
            setLoading(false);
            onSuccess();
        });
    };

    return {updatePlans, loading};
}