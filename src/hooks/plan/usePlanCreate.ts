import {PlanDto} from "@harding/meals-api";
import PlanRepository from "../../repository/PlanRepository.ts";
import {useState} from "react";

export const usePlanCreate = (): {
    createPlan: (plan: PlanDto, onSuccess: (createdPlan: PlanDto) => void) => void,
    loading: boolean
} => {

    const repository = new PlanRepository();

    const [loading, setLoading] = useState<boolean>(false);

    const createPlan = (plan: PlanDto, onSuccess: (createdPlan: PlanDto) => void) => {
        setLoading(true);
        repository.createPlan(plan, (createdPlan: PlanDto) => {
            setLoading(false);
            onSuccess(createdPlan);
        });
    };

    return {createPlan, loading};
}