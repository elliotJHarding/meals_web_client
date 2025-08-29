import { useState } from "react";
import PlanRepository from "../../repository/PlanRepository.ts";
import Plan from "../../domain/Plan.ts";

export const useAiGeneration = () => {
    const repository = new PlanRepository();
    const [loading, setLoading] = useState<boolean>(false);
    const [failed, setFailed] = useState<boolean>(false);

    const generateMealPlan = (startDate: Date, endDate: Date, prompt: string, onSuccess: (plans: Plan[]) => void) => {
        setLoading(true);
        setFailed(false);

        try {
            repository.generateMealPlan(
                startDate,
                endDate,
                prompt,
                (generatedPlans) => {
                    setLoading(false);
                    onSuccess(generatedPlans);
                },
                () => {
                    setLoading(false);
                    setFailed(true);
                }
            );
        } catch (error) {
            console.error("Error generating meal plan:", error);
            setLoading(false);
            setFailed(true);
        }
    };

    return { generateMealPlan, loading, failed };
};