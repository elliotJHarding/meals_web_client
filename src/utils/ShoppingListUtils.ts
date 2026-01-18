import {ShoppingListItemDto} from "@harding/meals-api";

export function sortShoppingListItems(a: ShoppingListItemDto | undefined, b: ShoppingListItemDto | undefined): number {
    const textA = a?.ingredient?.name?.toUpperCase() ?? '';
    const textB = b?.ingredient?.name?.toUpperCase() ?? '';

    // Handle undefined cases
    if (a === undefined) return b === undefined ? 0 : 1;
    if (b === undefined) return -1;

    return textA.localeCompare(textB);
}
