import {Card} from "@mui/material";
import MealPlan from "../../../../../domain/MealPlan.ts";
import Box from "@mui/material/Box";
import Meal from "../../../../../domain/Meal.ts";
import {motion} from "framer-motion";
import DayItem from "./DayItem.tsx";

export default function ChooseMeals({mealPlan, setMealPlan, meals, mealsLoading, mealsFailed}: {
    mealPlan: MealPlan,
    setMealPlan: (mealPlan: MealPlan) => void,
    meals: Meal[],
    mealsLoading: boolean,
    mealsFailed: boolean,
}) {

    const dayItems = mealPlan.plans.map((plan, i) =>
        <DayItem index={i}
                 plan={plan}
                 meals={meals}
                 mealsLoading={mealsLoading}
                 mealsFailed={mealsFailed}
                 mealPlan={mealPlan}
                 setMealPlan={setMealPlan}/>
    );

    return (
        <Card component={motion.div}
              initial={{x:100, opacity: 0 }}
              animate={{x:0, opacity: 1 }}
              exit={{x: 100, opacity: 0 }}>
            <Box sx={{padding: 2}}>
                <table>
                    <tbody>
                    {dayItems}
                    </tbody>
                </table>
            </Box>
        </Card>
    );
}
