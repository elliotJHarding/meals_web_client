import Meal from "./Meal.ts";

export default interface Plan {
    id?: number,
    date: Date,
    dinner?: Meal
}