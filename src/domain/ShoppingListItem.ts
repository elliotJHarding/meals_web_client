import {Ingredient} from "./Ingredient.ts";

export default interface ShoppingListItem {
    id: number;
    ingredient: Ingredient;
    checked: boolean;
    planId?: number;
}

export function sortShoppingListItems(a: ShoppingListItem | undefined, b: ShoppingListItem | undefined) : number {
    const textA = a?.ingredient?.name?.toUpperCase() ?? '';
    const textB = b?.ingredient?.name?.toUpperCase() ?? '';

    // Handle undefined cases
    if (a === undefined) return b === undefined ? 0 : 1;
    if (b === undefined) return -1;

    return textA.localeCompare(textB);
}
