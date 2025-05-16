import Box from "@mui/material/Box";
import {Stack, Step, StepLabel, Stepper, Typography} from "@mui/material";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import ChooseMeals from "./steps/choose/ChooseMeals.tsx";
import {useMeals} from "../../../hooks/meal/useMeals.ts";
import Button from "@mui/material-next/Button";
import {ArrowBackIos, ArrowForwardIos} from "@mui/icons-material";
import {motion} from "framer-motion";
import CheckIngredients from "./steps/check/CheckIngredients.tsx";
import {usePlans} from "../../../hooks/plan/usePlans.ts";
import ShoppingList from "./steps/list/ShoppingList.tsx";

export default function PlanWizard() {

    const {meals, loading, failed} = useMeals();

    const {step} = useParams();

    const [searchParams] = useSearchParams();

    const {from, to} = {from: searchParams.get('from'), to: searchParams.get('to')}

    const {fromDate, toDate} = {fromDate: new Date(from ?? ''), toDate: new Date(to ?? '')}

    const {mealPlan, setMealPlan} = usePlans(fromDate, toDate);

    const navigate = useNavigate();

    const steps = [
        {
            label: "Choose Meals",
            url: "choose",
            next: "ingredients",
            back: null,
            component: <ChooseMeals mealPlan={mealPlan}
                                    from={from} to={to}
                                    setMealPlan={setMealPlan}
                                    meals={meals}
                                    mealsLoading={loading}
                                    mealsFailed={failed}/>,
        },
        {
            label: "Check Ingredients",
            url: "ingredients",
            next: "shopping",
            back: "choose",
            component: <CheckIngredients mealPlan={mealPlan}
                                         setMealPlan={setMealPlan}/>,
        },
        {
            label: "Shopping List",
            url: "shopping",
            next: null,
            back: "ingredients",
            component: <ShoppingList mealPlan={mealPlan}/>
        }
    ]

    const activeStep = steps.map(step => step.url).indexOf(step ?? "")

    const component = steps[activeStep].component;
    const next = steps[activeStep].next;
    const back = steps[activeStep].back;

    const stepItems = steps.map(step =>
        <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
        </Step>
    )

    return (
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{mt: 6, mb: 4}}>
                {stepItems}
            </Stepper>
            <Stack spacing={2} sx={{paddingLeft: 2, marginBottom: 1}} direction='row' alignItems='end' component={motion.div}>
                <Typography variant='h6'>
                    {`${fromDate?.toLocaleDateString('en-gb', {
                        day: "numeric",
                        month: "long"
                    })} - ${toDate?.toLocaleDateString('en-gb', {day: "numeric", month: "long"})}`}
                </Typography>
                <Box flexGrow={1}/>
                <Stack direction='row'  gap={2} component={motion.div} layout="position">
                    {back != null && <Button component={motion.div} startIcon={<ArrowBackIos/>} onClick={() => navigate(`/plans/create/${back}?from=${from}&to=${to}`)}>Back</Button>}
                    {next != null && <Button component={motion.div} endIcon={<ArrowForwardIos/>} variant='filled' onClick={() => navigate(`/plans/create/${next}?from=${from}&to=${to}`)}>Next</Button>}
                </Stack>
            </Stack>
            <Box component={motion.div}>
                {component}
            </Box>
        </Box>
    );
}