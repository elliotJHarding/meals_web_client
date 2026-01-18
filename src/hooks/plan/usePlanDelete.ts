import {useState} from "react";
import {PlanDto} from "@elliotJHarding/meals-api";
import PlanRepository from "../../repository/PlanRepository.ts";

export const usePlanDelete = (): {deletePlan: (plan: PlanDto, onSuccess: () => void) => void, loading: boolean} => {

    const repository = new PlanRepository();

    const [loading, setLoading] = useState(false);

    const deletePlan = (plan: PlanDto, onSuccess: () => void) => {
        setLoading(true);
        repository.deletePlan(plan, () => {
            setLoading(false);
            onSuccess();
        });
    };

    return {deletePlan, loading};
}