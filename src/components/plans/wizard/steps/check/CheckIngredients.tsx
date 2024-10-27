import MealPlan from "../../../../../domain/MealPlan.ts";
import {Card, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";
import IngredientCheck from "./IngredientCheck.tsx";
import {useEffect, useReducer} from "react";
import {Ingredient} from "../../../../../domain/Ingredient.ts";
import Box from "@mui/material/Box";
import {DoorSlidingOutlined, KitchenOutlined, ShoppingCartOutlined} from "@mui/icons-material";
import ingredientChecksReducer, {SetItemsAction} from "../../../../../reducer/IngredientChecksReducer.ts";

export type IngredientChecked = {
    ingredient: Ingredient,
    longevity?: string,
    checked: boolean
}

export function sortIngredientChecked(a: IngredientChecked | undefined, b: IngredientChecked | undefined) : number {
    const textA = a?.ingredient?.name?.toUpperCase() ?? '';
    const textB = b?.ingredient?.name?.toUpperCase() ?? '';

    // Handle undefined cases
    if (a === undefined) return b === undefined ? 0 : 1;
    if (b === undefined) return -1;

    return textA.localeCompare(textB);
}

export default function CheckIngredients({mealPlan} : {mealPlan: MealPlan}) {

    const initialState = (mp: MealPlan) => mp.plans
        .flatMap(plan => plan.dinner?.ingredients)
        .filter(ingredient => ingredient?.name != null)
        .map(ingredient => {
            return {
                ingredient: ingredient,
                longevity: ingredient?.metadata?.longevity,
                checked: ingredient?.metadata?.longevity != 'CUPBOARD'
            } as IngredientChecked
        })
        .sort(sortIngredientChecked);


    const [ingredientsChecked, dispatch] = useReducer(ingredientChecksReducer, mealPlan, initialState);

    useEffect(() => {
        dispatch(new SetItemsAction(initialState(mealPlan)))
    }, [mealPlan])

    const toComponents = (items: IngredientChecked[]) => items
        .map(ingredientChecked =>
            <IngredientCheck ingredient={ingredientChecked.ingredient}
                             checked={ingredientChecked.checked}
                             dispatch={dispatch}/>
        )

    return (
        <Card component={motion.div}
              initial={{x:200, opacity: 0 }}
              animate={{x:0, opacity: 1 }}
              exit={{x: -200, opacity: 0 }}>
            <Box sx={{padding: 3}}>
                <Stack gap={1} direction='row' alignItems='center'>
                    <KitchenOutlined/>
                    <Typography variant='h6'>Fresh</Typography>
                </Stack>
                <Stack gap={1}>
                    {toComponents(ingredientsChecked.filter(item => item.longevity == 'FRESH').sort(sortIngredientChecked))}
                </Stack>
                <Stack gap={1} direction='row' alignItems='center'>
                    <DoorSlidingOutlined/>
                    <Typography variant='h6'>Cupboard</Typography>
                </Stack>
                <Stack gap={1}>
                    {toComponents(ingredientsChecked.filter(item => item.longevity == 'CUPBOARD').sort(sortIngredientChecked))}
                </Stack>
                <Stack gap={1} direction='row' alignItems='center'>
                    <ShoppingCartOutlined/>
                    <Typography variant='h6'>Other</Typography>
                </Stack>
                <Stack gap={1}>
                    {toComponents(ingredientsChecked.filter(item => item.longevity == null).sort(sortIngredientChecked))}
                </Stack>
            </Box>
        </Card>
    )
}