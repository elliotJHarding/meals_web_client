import {IngredientChecked, sortIngredientChecked} from "../components/plans/wizard/steps/check/CheckIngredients.tsx";

interface ChecksAction {
    apply(state: IngredientChecked[]) : IngredientChecked[]
}

export class CheckItemAction implements ChecksAction {
    id: bigint;
    checked: boolean;

    constructor(checked: boolean, id: bigint) {
        this.checked = checked;
        this.id = id;
    }

    apply(state: IngredientChecked[]): IngredientChecked[] {
        let item = state.find(i => i.ingredient.id == this.id);

        return [
            ...state.filter(i => i.ingredient.id != this.id),
            {...item, checked: this.checked} as IngredientChecked
        ].sort(sortIngredientChecked)
    }

}

export class SetItemsAction implements ChecksAction {
    items: IngredientChecked[]

    constructor(items: IngredientChecked[]) {
        this.items = items;
    }

    apply(_state: IngredientChecked[]): IngredientChecked[] {
        return this.items;
    }
}

export default function ingredientChecksReducer(state: IngredientChecked[], action: ChecksAction): IngredientChecked[] {
    return action.apply(state);
}