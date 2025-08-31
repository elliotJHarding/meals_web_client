import {usePlans} from "../../hooks/plan/usePlans.ts";
import MealPlan from "../../domain/MealPlan.ts";
import WeekPlan from "./WeekPlan.tsx";
import Grid from "@mui/material/Unstable_Grid2";
import {Stack, Typography, Card, Skeleton} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const WeekPlanSkeleton = () => (
    <motion.div
        key="skeleton"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
    >
        <Card sx={{ borderRadius: 3, padding: 2 }}>
            <Stack spacing={2}>
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                <Stack spacing={1}>
                    <Skeleton variant="rectangular" height={24} width="70%" sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" height={24} width="85%" sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" height={24} width="60%" sx={{ borderRadius: 1 }} />
                </Stack>
            </Stack>
        </Card>
    </motion.div>
);

const AnimatedWeekPlan = ({ mealPlan }: { mealPlan: MealPlan }) => (
    <motion.div
        key="content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
    >
        <WeekPlan mealPlan={mealPlan} />
    </motion.div>
);

export default function Plans() {

    const getLastStartOfWeek = () => {
        const date = new Date(today);
        date.setDate(today.getDate() - dayDifference);
        return date;
    }

    const getNextStartOfWeek = () => {
        const date = new Date(lastStartOfWeek);
        date.setDate(lastStartOfWeek.getDate() + 7);
        return date;
    }

    const getEndOfWeek = (startOfWeek: Date) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + 6);
        return date;
    }

    const startOfWeek = 1;

    const today = new Date();
    const delta = today.getDay() - startOfWeek;
    const dayDifference = delta < 0 ? delta + 7 : delta;
    const lastStartOfWeek = getLastStartOfWeek();
    const nextStartOfWeek = getNextStartOfWeek();

    const thisWeek = usePlans(
        lastStartOfWeek,
        getEndOfWeek(lastStartOfWeek),
    );

    const nextWeek = usePlans(
        nextStartOfWeek,
        getEndOfWeek(nextStartOfWeek),
    );

    return (
        <Grid container spacing={2} sx={{minHeight: '60vh'}}>
            <Grid xs={12} md={6}>
                <Stack direction='row' spacing={2} alignItems="center">
                    <Typography variant='h6'>
                        This Week
                    </Typography>
                    <AnimatePresence>
                        {!thisWeek.loading && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 0.5, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                            >
                                <Typography sx={{opacity: 0.5}}>
                                    {`${lastStartOfWeek.toLocaleDateString('en-gb', {day: "numeric", month: "long"})} - ${getEndOfWeek(lastStartOfWeek).toLocaleDateString('en-gb', {day: "numeric", month: "long"})}`}
                                </Typography>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Stack>
                <AnimatePresence mode="wait">
                    {thisWeek.loading ? 
                        <WeekPlanSkeleton /> : 
                        <AnimatedWeekPlan mealPlan={new MealPlan(thisWeek.mealPlan.plans)} />
                    }
                </AnimatePresence>
            </Grid>
            <Grid xs={12} md={6}>
                <Stack direction='row' spacing={2} alignItems="center">
                    <Typography variant='h6'>
                        Next Week
                    </Typography>
                    <AnimatePresence>
                        {!nextWeek.loading && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 0.5, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                            >
                                <Typography sx={{opacity: 0.5}}>
                                    {`${nextStartOfWeek.toLocaleDateString('en-gb', {day: "numeric", month: "long"})} - ${getEndOfWeek(nextStartOfWeek).toLocaleDateString('en-gb', {day: "numeric", month: "long"})}`}
                                </Typography>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Stack>
                <AnimatePresence mode="wait">
                    {nextWeek.loading ? 
                        <WeekPlanSkeleton /> : 
                        <AnimatedWeekPlan mealPlan={new MealPlan(nextWeek.mealPlan.plans)} />
                    }
                </AnimatePresence>
            </Grid>
        </Grid>
    )
}
