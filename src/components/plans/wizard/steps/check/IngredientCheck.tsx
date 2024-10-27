import {Card, Checkbox, Stack, Typography} from "@mui/material";
import {Ingredient} from "../../../../../domain/Ingredient.ts";
import {CheckItemAction} from "../../../../../reducer/IngredientChecksReducer.ts";
import {motion} from "framer-motion";

export default function IngredientCheck({ingredient, checked, dispatch}: {
    ingredient: Ingredient,
    checked: boolean,
    dispatch: any
}) {

    const onClick = () => {
        ingredient.id != null &&
            dispatch(new CheckItemAction(!checked, ingredient.id));
    }

    return (
        // <Card sx={{padding: 1, opacity: checked ? 1 : 0.4, cursor: 'pointer'}} onClick={onClick}>
        <Card sx={{padding: 1, cursor: 'pointer'}} onClick={onClick} component={motion.div}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Stack direction='row' gap={1} alignItems='center'>
                <Checkbox checked={checked}/>
                <Typography>{ingredient?.amount}{ingredient?.unit?.shortStem}</Typography>
                <Typography>{ingredient?.name}</Typography>
            </Stack>
        </Card>
    )
}