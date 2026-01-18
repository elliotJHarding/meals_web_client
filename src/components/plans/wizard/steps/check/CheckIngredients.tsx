import MealPlan from "../../../../../domain/MealPlan.ts";
import {Card, Stack, Typography} from "@mui/material";
import {motion} from "framer-motion";
import IngredientCheck from "./IngredientCheck.tsx";
import {useEffect, useReducer} from "react";
import Box from "@mui/material/Box";
import {DoorSlidingOutlined, KitchenOutlined, ShoppingCartOutlined} from "@mui/icons-material";
import ingredientChecksReducer, {SetItemsAction} from "../../../../../reducer/IngredientChecksReducer.ts";
import {sortShoppingListItems} from "../../../../../utils/ShoppingListUtils.ts";
import {usePlansUpdate} from "../../../../../hooks/plan/usePlansUpdate.ts";
import {PlanDto, ShoppingListItemDto} from "@harding/meals-api";

// Extended type to track which plan each shopping list item belongs to
type ShoppingListItemWithPlanId = ShoppingListItemDto & { planId?: number };

export default function CheckIngredients({mealPlan, setMealPlan} : {mealPlan: MealPlan, setMealPlan: any}) {

    const initialState = (mp: MealPlan): ShoppingListItemWithPlanId[] => mp.plans
        .map(plan => {
            const itemsWithPlanId: ShoppingListItemWithPlanId[] = (plan.shoppingListItems ?? []).map(item => ({
                ...item,
                planId: plan.id
            }));
            return itemsWithPlanId;
        })
        .flat()
        .filter(item => item?.ingredient?.name != null)
        .sort(sortShoppingListItems);

    const [ingredientsChecked, dispatch] = useReducer(ingredientChecksReducer, mealPlan, initialState);

    const {updatePlans} = usePlansUpdate();

    useEffect(() => {
        dispatch(new SetItemsAction(initialState(mealPlan)))
    }, [mealPlan])

    const toComponents = (items: ShoppingListItemWithPlanId[]) => items
        .map(item =>
            <IngredientCheck ingredient={item.ingredient}
                             checked={item.checked}
                             dispatch={dispatch}
                             syncPlans={syncPlans}/>
        )

    const syncPlans = (items: ShoppingListItemWithPlanId[]) => {
        const groupedItems = Map.groupBy(items, item => item.planId);

        const newPlans = mealPlan.plans.map(plan => ({...plan, shoppingListItems: groupedItems.get(plan.id) ?? []} as PlanDto));

        setMealPlan({...mealPlan, plans: newPlans});

        updatePlans(
            newPlans,
            () => console.info('plans updated')
        );
    }

    return (
        <Card component={motion.div}
              initial={{x:200, opacity: 0 }}
              animate={{x:0, opacity: 1 }}
              exit={{x: -200, opacity: 0 }}>
            <Box sx={{padding: 3}} component={motion.div} layout>
                <Stack gap={1} direction='row' alignItems='center' component={motion.div} layout>
                    <KitchenOutlined/>
                    <Typography variant='h6'>Fresh</Typography>
                </Stack>
                <Stack gap={1}>
                    {toComponents(ingredientsChecked.filter(item => item.ingredient?.metadata?.longevity == 'FRESH').sort(sortShoppingListItems))}
                </Stack>
                <Stack gap={1} direction='row' alignItems='center'>
                    <DoorSlidingOutlined/>
                    <Typography variant='h6'>Cupboard</Typography>
                </Stack>
                <Stack gap={1}>
                    {toComponents(ingredientsChecked.filter(item => item.ingredient?.metadata?.longevity == 'CUPBOARD').sort(sortShoppingListItems))}
                </Stack>
                <Stack gap={1} direction='row' alignItems='center'>
                    <ShoppingCartOutlined/>
                    <Typography variant='h6'>Other</Typography>
                </Stack>
                <Stack gap={1}>
                    {toComponents(ingredientsChecked.filter(item => item.ingredient?.metadata?.longevity == null).sort(sortShoppingListItems))}
                </Stack>
            </Box>
        </Card>
    )
}