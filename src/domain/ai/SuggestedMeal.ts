import Meal from "../Meal.ts";

export default interface SuggestedMeal {
    meal: Meal;
    rank: number;
    suitability_score: number;
}
