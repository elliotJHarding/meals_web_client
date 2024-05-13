import {List, ListItem} from "@mui/material-next";
import IngredientEditRow from "./IngredientEditRow.tsx";
import {IngredientEdit} from "./Ingredients.tsx";
import {AnimatePresence, motion} from "framer-motion";

export default function IngredientEditList({ingredientEdits, setIngredientEdits}: { ingredientEdits: IngredientEdit[] , setIngredientEdits : any}) {

    const editItems = ingredientEdits
        .sort((a, b) => a.index - b.index)
        .map((edit: IngredientEdit) =>
            <ListItem key={edit.index} sx={{py: 0.2, px: 0}} component={motion.div} layout>
                <IngredientEditRow edit={edit} ingredientEdits={ingredientEdits} setIngredientEdits={setIngredientEdits}/>
            </ListItem>
        )

    return (
        <AnimatePresence>
            <List component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                {editItems}
            </List>
        </AnimatePresence>
    )
}