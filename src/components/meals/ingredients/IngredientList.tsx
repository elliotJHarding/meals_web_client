import {List, ListItem} from "@mui/material-next";
import {Typography} from "@mui/material";
import {shortFormat} from "../../../utils/IngredientUtils.ts";
import {IngredientDto} from "@elliotJHarding/meals-api";
import {AnimatePresence, motion} from "framer-motion";

export default function IngredientList({ingredients}: { ingredients: IngredientDto[] }) {
    const ingredientItems = ingredients
        .sort((a, b) => a.index! - b.index!)
        .map((ingredient: IngredientDto) =>
        <ListItem key={ingredient.index} component={motion.div} layout>
            <Typography>{shortFormat(ingredient)}</Typography>
        </ListItem>
    )

    return (
        <AnimatePresence>
            <List component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                {ingredientItems}
            </List>
        </AnimatePresence>
    )
}