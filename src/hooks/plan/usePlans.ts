import PlanRepository from "../../repository/PlanRepository.ts";
import {useEffect, useState} from "react";
import Plan from "../../domain/Plan.ts";

export const usePlans = (start : Date, end : Date)  => {
    const repository = new PlanRepository();

    const [plans, setPlans] = useState<Plan[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [failed, setFailed] = useState<boolean>(false);

    useEffect(() =>
        repository.getPlans(
            start, end,
            (plans) => {
                console.log(plans);
                setLoading(false);
                setPlans(plans);
            },
            () => {
                setFailed(true);
                setLoading(false);
            })
    ,[])

    return {plans, setPlans, loading, failed}
}