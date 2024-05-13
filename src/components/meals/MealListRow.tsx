import Meal from "../../domain/Meal.ts";
import Grid from "@mui/material/Unstable_Grid2";
import {Card, CardActionArea, CardMedia, Fade, Typography} from "@mui/material";
import EffortChip from "./chip/EffortChip.tsx";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
// import ServesChip from "./chip/ServesChip.tsx";
import PrepTimeChip from "./chip/PrepTimeChip.tsx";

const constant = {
    padding: 1,
    gap: 1,
    imageWidth: 130,
    imageBorderRadius: 3,
    cardBorderRadius: 3,
}

export default function MealListRow({meal, index} : {meal : Meal, index : number}) {

    const navigateTo = useNavigate();

    const handleClick = () => navigateTo(`${meal.id}`);

    return (
        <Fade in unmountOnExit timeout={200 * index}>
            <Grid xs={12} onClick={handleClick}>
                <CardActionArea>
                    <Card sx={{borderRadius: constant.cardBorderRadius, padding: constant.padding, display: 'flex', gap: constant.gap}}>
                        <CardMedia
                            sx={{width: constant.imageWidth, borderRadius: constant.imageBorderRadius}}
                            image={meal.image?.url}
                        />
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: constant.gap, py: 1}}>
                            <Typography variant='h5'>
                                {meal.name}
                            </Typography>
                            <Box sx={{display: 'flex', gap: 1}}>
                                <PrepTimeChip prepTimeMinutes={meal.prepTimeMinutes} size={'small'}/>
                                {/*<ServesChip serves={meal.serves} size={'small'}/>*/}
                                <EffortChip effort={meal.effort} size={'small'}/>
                            </Box>
                        </Box>
                    </Card>
                </CardActionArea>
            </Grid>
        </Fade>
    )
}
