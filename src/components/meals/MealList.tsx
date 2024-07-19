import Meal from "../../domain/Meal.ts";
import MealListRow from "./MealListRow.tsx";
import Grid from "@mui/material/Unstable_Grid2";
import Error from "../error/Error.tsx";
import {WarningRounded} from "@mui/icons-material";
// import {Skeleton} from "@mui/material";

const constant = {
    spacing: 1
}

export default function MealList({meals, loading, failed, mealOnClick} : {meals : Meal[], loading : boolean, failed : boolean, mealOnClick: (meal: Meal) => void}) {

    const mealRows = meals.map((meal : Meal, index : number) => <MealListRow key={meal.id} meal={meal} index={index} onClick={mealOnClick} />);

    const skeleton =
        <>
            {/*<Grid xs={12}><Skeleton variant='rounded' height={100}/></Grid>*/}
            {/*<Grid xs={12}><Skeleton variant='rounded' height={100}/></Grid>*/}
            {/*<Grid xs={12}><Skeleton variant='rounded' height={100}/></Grid>*/}
        </>

    return (
        <Grid container spacing={constant.spacing} sx={{height: '100%'}}>
            {loading && skeleton}
            {failed ? <Error message={"Error loading meals"} icon={<WarningRounded fontSize='large'/>}/> : mealRows}
        </Grid>
    )
}

