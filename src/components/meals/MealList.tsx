import {MealDto} from "@elliotJHarding/meals-api";
import MealListRow from "./MealListRow.tsx";
import Grid from "@mui/material/Unstable_Grid2";
import Error from "../error/Error.tsx";
import {WarningRounded} from "@mui/icons-material";
import {Skeleton} from "@mui/material";

const constant = {
    spacing: 1
}

export default function MealList({meals, loading, failed, mealOnClick} : {meals : MealDto[], loading : boolean, failed : boolean, mealOnClick: (meal: MealDto) => void}) {

    const mealRows = meals.map((meal : MealDto, index : number) => <MealListRow key={meal.id} meal={meal} index={index} onClick={mealOnClick} />);

    const skeleton =
        <>
            {Array.from({length: 6}, (_, i) =>
                <Grid xs={12}>
                    <Skeleton variant='rounded'
                              height={90}
                              animation={'wave'}
                              sx={{
                                  opacity: 0.85 - (i * 0.15),
                                  borderRadius: 4
                              }}
                    />
                </Grid>
            )}
        </>

    return (
        <Grid container spacing={constant.spacing}>
            {loading && skeleton}
            {failed ? <Error message={"Error loading meals"} icon={<WarningRounded fontSize='large'/>}/> : mealRows}
        </Grid>
    )
}

