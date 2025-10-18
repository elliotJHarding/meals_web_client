import Box from "@mui/material/Box";
import {Stack, Step, StepLabel, Stepper, Typography, useMediaQuery, useTheme} from "@mui/material";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import ChooseMeals from "./steps/choose/ChooseMeals.tsx";
import {useMeals} from "../../../hooks/meal/useMeals.ts";
import Button from "@mui/material-next/Button";
import {ArrowBackIos, ArrowForwardIos, Check} from "@mui/icons-material";
import {motion} from "framer-motion";
import CheckIngredients from "./steps/check/CheckIngredients.tsx";
import {usePlans} from "../../../hooks/plan/usePlans.ts";
import ShoppingList from "./steps/list/ShoppingList.tsx";

export default function PlanWizard() {

    const {meals, loading, failed} = useMeals();

    const {step} = useParams();

    const [searchParams] = useSearchParams();

    const {from, to, selected} = {from: searchParams.get('from'), to: searchParams.get('to'), selected: searchParams.get('selected')};

    const {fromDate, toDate} = {fromDate: new Date(from ?? ''), toDate: new Date(to ?? '')}

    const {mealPlan, setMealPlan} = usePlans(fromDate, toDate);

    const navigate = useNavigate();

    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const steps = [
        {
            label: "Choose Meals",
            url: "choose",
            next: "ingredients",
            back: null,
            component: <ChooseMeals mealPlan={mealPlan}
                                    from={from} to={to} selected={selected}
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
        <Step key={step.label} component={motion.div} layout>
            <StepLabel>{step.label}</StepLabel>
        </Step>
    )

    return (
        <Box id='container-wizard' sx={{width: '100%'}} component={motion.div} layout>
            <Stepper id='wizard-stepper' activeStep={activeStep} alternativeLabel sx={{mt: 6, mb: 4}}>
                {stepItems}
            </Stepper>
            <Stack id='wizard-plan-dates' spacing={2} sx={{paddingLeft: 2, marginBottom: 1}} direction='row' alignItems='end' component={motion.div} layout>
                <Typography variant='h6' component={motion.div} layout>
                    {`${fromDate?.toLocaleDateString('en-gb', {
                        day: "numeric",
                        month: isMobile ? "short": "long"
                    })} - ${toDate?.toLocaleDateString('en-gb', {day: "numeric", month: isMobile ? "short": "long"})}`}
                </Typography>
                <Box flexGrow={1}/>
                <Stack direction='row' gap={isMobile ? 0.5 : 2} component={motion.div} layout="position">
                    {back != null && <Button component={motion.div} startIcon={<ArrowBackIos sx={isMobile ? {fontSize: 16} : {}}/>} onClick={() => navigate(`/plans/create/${back}?from=${from}&to=${to}`)} sx={isMobile ? {px: 1, py: 0.5, minWidth: 'auto', fontSize: '0.813rem'} : {}}>Back</Button>}
                    {next != null && <Button component={motion.div} endIcon={<ArrowForwardIos sx={isMobile ? {fontSize: 16} : {}}/>} variant='filled' onClick={() => navigate(`/plans/create/${next}?from=${from}&to=${to}`)} sx={isMobile ? {px: 1, py: 0.5, minWidth: 'auto', fontSize: '0.813rem'} : {}}>Next</Button>}
                {next == null && <Button component={motion.div} endIcon={<Check sx={isMobile ? {fontSize: 16} : {}}/>} variant='filled' onClick={() => navigate(`/plans`)} sx={isMobile ? {px: 1, py: 0.5, minWidth: 'auto', fontSize: '0.813rem'} : {}}>Done</Button>}
                </Stack>
            </Stack>
            <Box id='wizard-step-holder' component={motion.div} layout>
                {component}
            </Box>
        </Box>
    );
}