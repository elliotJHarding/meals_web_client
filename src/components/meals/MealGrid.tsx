import Meal from "../../domain/Meal.ts";
import MealGridCard from "./MealGridCard.tsx";
import Grid from "@mui/material/Unstable_Grid2";
import Error from "../error/Error.tsx";
import {WarningRounded} from "@mui/icons-material";
import {Skeleton} from "@mui/material";

const constant = {
    spacing: 2
}

export default function MealGrid({meals, loading, failed, mealOnClick} : {meals : Meal[], loading : boolean, failed : boolean, mealOnClick: (meal: Meal) => void}) {

    const mealCards = meals.map((meal : Meal, index : number) => (
        <Grid key={meal.id} xs={12} sm={6} md={4} lg={3}>
            <MealGridCard meal={meal} index={index} onClick={mealOnClick} />
        </Grid>
    ));

    const skeleton = (
        <>
            {Array.from({length: 8}, (_, i) => (
                <Grid key={i} xs={12} sm={6} md={4} lg={3}>
                    <Skeleton 
                        variant='rounded'
                        height={240}
                        animation={'wave'}
                        sx={{
                            opacity: 0.85 - (i * 0.1),
                            borderRadius: 3
                        }}
                    />
                </Grid>
            ))}
        </>
    );

    return (
        <Grid container spacing={constant.spacing}>
            {loading && skeleton}
            {failed ? (
                <Grid xs={12}>
                    <Error message={"Error loading meals"} icon={<WarningRounded fontSize='large'/>}/>
                </Grid>
            ) : mealCards}
        </Grid>
    )
}