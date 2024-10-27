import {IngredientEdit} from "../components/meals/ingredients/Ingredients.tsx";
import {parseUnit, Unit} from "./Unit.ts";
import Meal from "./Meal.ts";
import {IngredientMetadata} from "./IngredientMetadata.ts";

export interface Ingredient {
    index: number;
    id?: bigint;
    name: string | null;
    amount: number | null;
    unit: Unit | null;
    meal: Meal;
    metadata?: IngredientMetadata;
}

export function shortFormat(ingredient : Ingredient) {
    if (ingredient.unit != null) {
        return `${ingredient.amount}${ingredient.unit.shortSpace ? ' ' : ''}${ingredient.unit.shortStem}${ingredient.unit.shortPluralise ? 's' : ''} ${ingredient.name}`
    } else {
        return `${ingredient.amount} ${ingredient.name}`
    }
}

export function longFormat(ingredient : Ingredient) {
    if (ingredient.unit != null) {
        return `${ingredient.name} ${ingredient.amount}${ingredient.unit.longSpace ? ' ' : ''}${ingredient.unit.longStem}${ingredient.unit.longPluralise ? 's' : ''}`
    } else {
        return `${ingredient.name} ${ingredient.amount}`
    }
}

export function parseIngredient(edit : IngredientEdit, units : Unit[], parentMeal : Meal) : Ingredient | null {
    let amountMatch = edit.input.match('^[0-9.]+');
    let unitMatch = edit.input.match('(?:^[0-9.]+ ?)([a-zA-Z]+)(?: )');
    let nameMatch = edit.input.match('(?:^[0-9.]+ ?[a-zA-Z]* )([a-zA-Z ]+)')

    if (amountMatch != null && nameMatch != null) {
        let amount = parseFloat(amountMatch[0]);
        let name = nameMatch[1]
        let unit : Unit | null = null;

        if (unitMatch != null) {
            unit = parseUnit(units, unitMatch[1]);
            if (unit == null) {
                name = unitMatch[1] + ' ' + name;
            }
        }

        let ingredient : Ingredient = {
            index: edit.index,
            name: name,
            amount: amount,
            unit: unit,
            meal: parentMeal
        }



        return ingredient;
    } else {
        return null;
    }
}
