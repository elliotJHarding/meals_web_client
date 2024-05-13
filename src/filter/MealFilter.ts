import Filter from "./Filter.tsx";
import Meal from "../domain/Meal.ts";
import MealFilterCriteria from "./MealFilterCriteria.ts";

export default class MealFilter implements Filter<Meal> {

    criteria : MealFilterCriteria;

    constructor(criteria : MealFilterCriteria) {
        this.criteria = criteria;
    }

    filter(itemList : Meal[]) : Meal[] {

        itemList = this.criteria.name == null ? itemList :
            itemList.filter((meal : Meal) => meal.name.includes(this.criteria.name!));

        itemList = this.criteria.effort.length == 0 ? itemList :
            itemList.filter((meal: Meal) => meal.effort != undefined && this.criteria.effort?.includes(meal.effort));

        itemList = itemList.sort(function(a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        return(itemList)
    }
}