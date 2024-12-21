import Meal from "./Meal.ts";
import ShoppingListItem from "./ShoppingListItem.ts";

export default interface Plan {
    id?: number,
    date: Date,
    dinner?: Meal
    shoppingListItems: ShoppingListItem[];
}