import Meal from "../../domain/Meal.ts";
import Grid from "@mui/material/Unstable_Grid2";
import {Card, CardActionArea, CardMedia, Fade, Typography} from "@mui/material";
import EffortChip from "./chip/EffortChip.tsx";
import Box from "@mui/material/Box";
import PrepTimeChip from "./chip/PrepTimeChip.tsx";
import IngredientsStatusChip from "./chip/IngredientsStatusChip.tsx";
import {RestaurantMenu} from "@mui/icons-material";

const constant = {
    padding: 1,
    gap: 1,
    imageWidth: 130,
    imageBorderRadius: 3,
    cardBorderRadius: 3,
}

export default function MealListRow({meal, index, onClick} : {meal : Meal, index : number, onClick: (meal : Meal) => void}) {

    const handleClick = () => onClick(meal);

    return (
        <Fade in unmountOnExit timeout={200 * index}>
            <Grid xs={12} onClick={handleClick}>
                <CardActionArea>
                    <Card sx={{borderRadius: constant.cardBorderRadius, padding: constant.padding, display: 'flex', gap: constant.gap}}>
                        {meal.image?.url ? (
                            <CardMedia
                                sx={{width: constant.imageWidth, borderRadius: constant.imageBorderRadius}}
                                image={meal.image.url}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: constant.imageWidth,
                                    borderRadius: constant.imageBorderRadius,
                                    backgroundColor: 'grey.100',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <RestaurantMenu sx={{ fontSize: 48, color: 'grey.300' }} />
                            </Box>
                        )}
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: constant.gap, py: 1}}>
                            <Typography variant='h5'>
                                {meal.name}
                            </Typography>
                            <Box sx={{display: 'flex', gap: 1}}>
                                <PrepTimeChip prepTimeMinutes={meal.prepTimeMinutes} size={'small'}/>
                                <EffortChip effort={meal.effort} size={'small'}/>
                                <IngredientsStatusChip meal={meal} size={'small'}/>
                            </Box>
                        </Box>
                    </Card>
                </CardActionArea>
            </Grid>
        </Fade>
    )
}
