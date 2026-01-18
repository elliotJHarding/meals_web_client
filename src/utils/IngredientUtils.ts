import {IngredientDto, UnitDto, MealDto} from "@harding/meals-api";
import {parseUnit} from "./UnitUtils.ts";
import {IngredientEdit} from "../types/IngredientEdit.ts";

export function shortFormat(ingredient: IngredientDto): string {
    if (ingredient.unit != null) {
        return `${ingredient.amount}${ingredient.unit.shortSpace ? ' ' : ''}${ingredient.unit.shortStem}${ingredient.unit.shortPluralise ? 's' : ''} ${ingredient.name}`;
    } else {
        return `${ingredient.amount} ${ingredient.name}`;
    }
}

export function longFormat(ingredient: IngredientDto): string {
    if (ingredient.unit != null) {
        return `${ingredient.name} ${ingredient.amount}${ingredient.unit.longSpace ? ' ' : ''}${ingredient.unit.longStem}${ingredient.unit.longPluralise ? 's' : ''}`;
    } else {
        return `${ingredient.name} ${ingredient.amount}`;
    }
}

export function parseIngredient(edit: IngredientEdit, units: UnitDto[], parentMeal: MealDto): IngredientDto | null {
    let amountMatch = edit.input.match('^[0-9.]+');
    let unitMatch = edit.input.match('(?:^[0-9.]+ ?)([a-zA-Z]+)(?: )');
    let nameMatch = edit.input.match('(?:^[0-9.]+ ?[a-zA-Z]* )([a-zA-Z ]+)');

    if (amountMatch != null && nameMatch != null) {
        let amount = parseFloat(amountMatch[0]);
        let name = nameMatch[1];
        let unit: UnitDto | null = null;

        if (unitMatch != null) {
            unit = parseUnit(units, unitMatch[1]);
            if (unit == null) {
                name = unitMatch[1] + ' ' + name;
            }
        }

        let ingredient: IngredientDto = {
            index: edit.index,
            id: edit.id,
            name: name,
            amount: amount,
            unit: unit ?? undefined,
        };

        return ingredient;
    } else {
        return null;
    }
}
