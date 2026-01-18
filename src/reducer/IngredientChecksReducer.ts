import {ShoppingListItemDto} from "@harding/meals-api";
import {sortShoppingListItems} from "../utils/ShoppingListUtils.ts";

// Extended type to track which plan each shopping list item belongs to
type ShoppingListItemWithPlanId = ShoppingListItemDto & { planId?: number };

interface ChecksAction {
    apply(state: ShoppingListItemWithPlanId[]): ShoppingListItemWithPlanId[]
}

export class CheckItemAction implements ChecksAction {
    id: number;
    checked: boolean;
    callback: (state: ShoppingListItemWithPlanId[]) => void;

    constructor(checked: boolean, id: number, callback: (state: ShoppingListItemWithPlanId[]) => void) {
        this.checked = checked;
        this.id = id;
        this.callback = callback;
    }

    apply(state: ShoppingListItemWithPlanId[]): ShoppingListItemWithPlanId[] {
        const item = state.find(i => i.ingredient?.id == this.id);
        const items: ShoppingListItemWithPlanId[] = [
            ...state.filter(i => i.ingredient?.id != this.id),
            {...item, checked: this.checked} as ShoppingListItemWithPlanId
        ].sort(sortShoppingListItems);
        this.callback(items);
        return items;
    }

}

export class SetItemsAction implements ChecksAction {
    items: ShoppingListItemWithPlanId[]

    constructor(items: ShoppingListItemWithPlanId[]) {
        this.items = items;
    }

    apply(_state: ShoppingListItemWithPlanId[]): ShoppingListItemWithPlanId[] {
        return this.items;
    }
}

export default function ingredientChecksReducer(state: ShoppingListItemWithPlanId[], action: ChecksAction): ShoppingListItemWithPlanId[] {
    return action.apply(state);
}