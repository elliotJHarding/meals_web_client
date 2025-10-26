import Meal from "./Meal.ts";

export default interface PlanMeal {
    id?: number;
    meal: Meal;
    requiredServings: number;
    leftovers: boolean;
    note?: string;
}