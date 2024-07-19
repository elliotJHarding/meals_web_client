import {useState} from "react";
import Box from "@mui/material/Box";
import {Step, StepLabel, Stepper} from "@mui/material";
import {useLocation} from "react-router-dom";
import MealPlan from "../../../domain/MealPlan.ts";
import ChooseMeals from "./ChooseMeals.tsx";
import {useMeals} from "../../../hooks/meal/useMeals.ts";

export default function PlanWizard() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = ["Choose Meals", "Check Ingredients", "Shopping List"]

    const handleNext = () => setActiveStep(activeStep + 1);

    const {state} = useLocation();
    const [mealPlan, setMealPlan] = useState<MealPlan>(state?.mealPlan);

    const {meals, loading, failed} = useMeals();

    const stepItems = steps.map(label =>
        <Step key={label}>
            <StepLabel>{label}</StepLabel>
        </Step>
    )

    return (
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {stepItems}
            </Stepper>
            <ChooseMeals mealPlan={mealPlan} setMealPlan={setMealPlan} meals={meals} mealsLoading={loading} mealsFailed={failed}/>
        </Box>
    );
}