import ShoppingListItem, {sortShoppingListItems} from "../domain/ShoppingListItem.ts";

interface ChecksAction {
    apply(state: ShoppingListItem[]) : ShoppingListItem[]
}

export class CheckItemAction implements ChecksAction {
    id: bigint;
    checked: boolean;
    callback: (state: ShoppingListItem[]) => void;
    
    constructor(checked: boolean, id: bigint, callback: (state: ShoppingListItem[]) => void) {
        this.checked = checked;
        this.id = id;
        this.callback = callback;
    }

    apply(state: ShoppingListItem[]): ShoppingListItem[] {
        const item = state.find(i => i.ingredient.id == this.id);
        const items : ShoppingListItem[] = [
            ...state.filter(i => i.ingredient.id != this.id),
            {...item, checked: this.checked} as ShoppingListItem
        ].sort(sortShoppingListItems)
        this.callback(items);
        return items;
    }

}

export class SetItemsAction implements ChecksAction {
    items: ShoppingListItem[]

    constructor(items: ShoppingListItem[]) {
        this.items = items;
    }

    apply(_state: ShoppingListItem[]): ShoppingListItem[] {
        return this.items;
    }
}

export default function ingredientChecksReducer(state: ShoppingListItem[], action: ChecksAction): ShoppingListItem[] {
    return action.apply(state);
}