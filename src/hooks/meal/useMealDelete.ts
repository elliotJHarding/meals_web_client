import {useState} from "react";
import MealRepository from "../../repository/MealRepository.ts";

export const useMealDelete = (): { deleteMeal: (mealId: bigint, onSuccess: () => void) => void, loading: boolean } => {

    const repository = new MealRepository();

    const [loading, setLoading] = useState(false);

    const deleteMeal = (mealId: bigint, onSuccess: () => void) => {
        setLoading(true)
        repository.deleteMeal(mealId, () => {
            setLoading(false);
            onSuccess();
        });
    };

    return {deleteMeal, loading};
}
