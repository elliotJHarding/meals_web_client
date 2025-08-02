import Meal from "./Meal.ts";
import PlanMeal from "./PlanMeal.ts";
import ShoppingListItem from "./ShoppingListItem.ts";

export default interface Plan {
    id?: number,
    date: Date,
    planMeals: PlanMeal[]
    shoppingListItems: ShoppingListItem[];
    note?: string;
    
    // Backward compatibility helper
    readonly meals?: Meal[];
}