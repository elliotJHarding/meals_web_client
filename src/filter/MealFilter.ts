import Filter from "./Filter.tsx";
import {MealDto} from "@harding/meals-api";
import MealFilterCriteria from "./MealFilterCriteria.ts";

export default class MealFilter implements Filter<MealDto> {

    criteria: MealFilterCriteria;

    constructor(criteria: MealFilterCriteria) {
        this.criteria = criteria;
    }

    filter(itemList: MealDto[]): MealDto[] {

        itemList = this.criteria.name == null ? itemList :
            itemList.filter((meal: MealDto) => meal.name!.includes(this.criteria.name!));

        itemList = this.criteria.effort.length == 0 ? itemList :
            itemList.filter((meal: MealDto) => meal.effort != undefined && this.criteria.effort?.includes(meal.effort as any));

        itemList = itemList.sort(function(a, b) {
            const textA = a.name!.toUpperCase();
            const textB = b.name!.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        return (itemList);
    }
}