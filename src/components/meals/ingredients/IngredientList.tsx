import {List, ListItem} from "@mui/material-next";
import {Typography} from "@mui/material";
import {Ingredient, shortFormat} from "../../../domain/Ingredient.ts";
import {AnimatePresence, motion} from "framer-motion";

export default function IngredientList({ingredients}: { ingredients: Ingredient[] }) {
    const ingredientItems = ingredients
        .sort((a, b) => a.index - b.index)
        .map((ingredient: Ingredient) =>
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