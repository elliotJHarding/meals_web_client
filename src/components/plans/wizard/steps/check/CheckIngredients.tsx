import MealPlan from "../../../../../domain/MealPlan.ts";
import {Card, Divider} from "@mui/material";
import {motion} from "framer-motion";
import Box from "@mui/material/Box";
import {Longevity, MealDto, PlanDto, ShoppingListItemDto} from "@elliotJHarding/meals-api";
import {usePlansUpdate} from "../../../../../hooks/plan/usePlansUpdate.ts";
import MealIngredientsSection from "./MealIngredientsSection.tsx";
import {useEffect, useRef} from "react";

interface MealGroup {
    meal: MealDto;
    dayLabels: string[];
    shoppingListItems: ShoppingListItemDto[];
}

function buildMealGroups(mealPlan: MealPlan): MealGroup[] {
    const groups = new Map<number, MealGroup>();

    for (const plan of mealPlan.plans) {
        const dayLabel = new Date(plan.date).toLocaleDateString('en-gb', {weekday: 'short'});

        for (const planMeal of plan.planMeals ?? []) {
            if (planMeal.leftovers) continue;

            const mealId = planMeal.meal.id;
            if (mealId == null) continue;

            const mealIngredientIds = new Set(
                (planMeal.meal.ingredients ?? []).map(ing => ing.id).filter((id): id is number => id != null)
            );

            const matchingItems = (plan.shoppingListItems ?? []).filter(
                item => item.ingredient?.id != null && mealIngredientIds.has(item.ingredient.id)
            );

            const existing = groups.get(mealId);
            if (existing) {
                if (!existing.dayLabels.includes(dayLabel)) {
                    existing.dayLabels.push(dayLabel);
                }
                const existingIngIds = new Set(existing.shoppingListItems.map(i => i.ingredient?.id));
                for (const item of matchingItems) {
                    if (!existingIngIds.has(item.ingredient?.id)) {
                        existing.shoppingListItems.push(item);
                    }
                }
            } else {
                groups.set(mealId, {
                    meal: planMeal.meal,
                    dayLabels: [dayLabel],
                    shoppingListItems: [...matchingItems],
                });
            }
        }
    }

    return Array.from(groups.values());
}

export default function CheckIngredients({mealPlan, setMealPlan, refetchPlans}: {
    mealPlan: MealPlan,
    setMealPlan: any,
    refetchPlans: () => void,
}) {
    const {updatePlans} = usePlansUpdate();
    const hasAutoChecked = useRef(false);

    useEffect(() => {
        if (hasAutoChecked.current || mealPlan.plans.length === 0) return;

        let changed = false;
        const newPlans: PlanDto[] = mealPlan.plans.map(plan => ({
            ...plan,
            shoppingListItems: (plan.shoppingListItems ?? []).map(item => {
                if (!item.checked && item.ingredient?.metadata?.longevity === Longevity.FRESH) {
                    changed = true;
                    return {...item, checked: true};
                }
                return item;
            }),
        }));

        hasAutoChecked.current = true;

        if (changed) {
            const newMealPlan = new MealPlan(newPlans);
            setMealPlan(newMealPlan);
            updatePlans(newPlans, () => console.info('Auto-checked fresh items'));
        }
    }, [mealPlan]);

    const mealGroups = buildMealGroups(mealPlan);

    const handleCheckToggle = (ingredientId: number) => {
        const newPlans: PlanDto[] = mealPlan.plans.map(plan => ({
            ...plan,
            shoppingListItems: (plan.shoppingListItems ?? []).map(item =>
                item.ingredient?.id === ingredientId
                    ? {...item, checked: !item.checked}
                    : item
            ),
        }));

        const newMealPlan = new MealPlan(newPlans);
        setMealPlan(newMealPlan);

        updatePlans(newPlans, () => console.info('plans updated'));
    };

    const handleMealUpdated = () => {
        updatePlans(mealPlan.plans, () => {
            refetchPlans();
        });
    };

    return (
        <Card component={motion.div}
              initial={{x: 200, opacity: 0}}
              animate={{x: 0, opacity: 1}}
              exit={{x: -200, opacity: 0}}>
            <Box sx={{padding: 3}} component={motion.div} layout>
                {mealGroups.map((group, index) => (
                    <Box key={group.meal.id}>
                        {index > 0 && <Divider sx={{my: 1}}/>}
                        <MealIngredientsSection
                            meal={group.meal}
                            dayLabels={group.dayLabels}
                            shoppingListItems={group.shoppingListItems}
                            onCheckToggle={handleCheckToggle}
                            onMealUpdated={handleMealUpdated}
                        />
                    </Box>
                ))}
            </Box>
        </Card>
    );
}
