import Meal from "../../domain/Meal.ts";
import MealListRow from "./MealListRow.tsx";
import Grid from "@mui/material/Unstable_Grid2";
// import {Skeleton} from "@mui/material";

const constant = {
    spacing: 1
}

export default function MealList({meals, loading} : {meals : Meal[], loading : boolean}) {
    const mealRows = meals.map((meal : Meal, index : number) => <MealListRow key={meal.id} meal={meal} index={index}/>);

    const skeleton =
        <>
            {/*<Grid xs={12}><Skeleton variant='rounded' height={100}/></Grid>*/}
            {/*<Grid xs={12}><Skeleton variant='rounded' height={100}/></Grid>*/}
            {/*<Grid xs={12}><Skeleton variant='rounded' height={100}/></Grid>*/}
        </>

    return (
        <Grid container spacing={constant.spacing}>
            {loading ? skeleton : mealRows}
        </Grid>
    )
}

