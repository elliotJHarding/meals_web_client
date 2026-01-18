import FilterCriteria from "./FilterCriteria.ts";
import {Effort} from "@harding/meals-api";

export default interface MealFilterCriteria extends FilterCriteria {
    name: string | null;
    effort: string[]; // Effort is a string enum in API package
}
