import FilterCriteria from "./FilterCriteria.ts";
import {Effort} from "@elliotJHarding/meals-api";

export default interface MealFilterCriteria extends FilterCriteria {
    name: string | null;
    effort: string[]; // Effort is a string enum in API package
}
