import Effort from "./Effort.ts";
import Image from "./Image.ts";
import {Ingredient} from "./Ingredient.ts";
import {Recipe} from "./Recipe.ts";

export default interface Meal {
    id? : bigint;
    name : string;
    description : string;
    effort? : Effort;
    image? : Image;
    serves : number;
    prepTimeMinutes : number;
    ingredients: Ingredient[];
    recipe?: Recipe;
    _links? : {
        self: {
            href: string
        }
    }
}