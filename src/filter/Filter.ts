import FilterCriteria from "./FilterCriteria.ts";

export default interface Filter<T> {

    criteria : FilterCriteria;

    filter(itemList : T[]) : T[]
}