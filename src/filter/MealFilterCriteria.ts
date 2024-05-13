import FilterCriteria from "./FilterCriteria.ts";
import Effort from "../domain/Effort.ts";

export default interface MealFilterCriteria extends FilterCriteria {
    name : string | null;
    effort : Effort[];

}
