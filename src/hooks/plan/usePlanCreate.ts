import Plan from "../../domain/Plan.ts";
import PlanRepository from "../../repository/PlanRepository.ts";
import {useState} from "react";

export const usePlanCreate = (): {
    createPlan: (plan: Plan, onSuccess: (createdPlan: Plan) => void) => void,
    loading: boolean
} => {

    const repository = new PlanRepository();

    const [loading, setLoading] = useState<boolean>(false);

    const createPlan = (plan : Plan, onSuccess : (createdPlan: Plan) => void) => {
        setLoading(true)
        repository.createPlan(plan, (createdPlan: Plan) => {
            setLoading(false);
            onSuccess(createdPlan);
        });
    };

    return {createPlan, loading};
}