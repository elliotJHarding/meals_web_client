import {MealDto} from "@harding/meals-api";
import {Card, CardActionArea, CardMedia, Fade, Typography, Stack} from "@mui/material";
import EffortChip from "./chip/EffortChip.tsx";
import Box from "@mui/material/Box";
import PrepTimeChip from "./chip/PrepTimeChip.tsx";
import ServesChip from "./chip/ServesChip.tsx";
import IngredientsStatusChip from "./chip/IngredientsStatusChip.tsx";
import {RestaurantMenu} from "@mui/icons-material";

const constant = {
    padding: 1.5,
    gap: 1,
    imageHeight: 120,
    imageBorderRadius: 2,
    cardBorderRadius: 3,
}

export default function MealGridCard({meal, index, onClick} : {meal : MealDto, index : number, onClick: (meal : MealDto) => void}) {

    const handleClick = () => onClick(meal);

    return (
        <Fade in unmountOnExit timeout={150 * (index % 4) + 100}>
            <Card sx={{
                borderRadius: constant.cardBorderRadius, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                }
            }}>
                <CardActionArea
                    onClick={handleClick}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch'
                    }}
                >
                    {meal.image?.url ? (
                        <CardMedia
                            sx={{
                                height: constant.imageHeight,
                                borderRadius: `${constant.imageBorderRadius}px ${constant.imageBorderRadius}px 0 0`,
                                flexShrink: 0
                            }}
                            image={meal.image.url}
                        />
                    ) : (
                        <Box
                            sx={{
                                height: constant.imageHeight,
                                borderRadius: `${constant.imageBorderRadius}px ${constant.imageBorderRadius}px 0 0`,
                                flexShrink: 0,
                                backgroundColor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <RestaurantMenu sx={{ fontSize: 56, color: 'grey.300' }} />
                        </Box>
                    )}
                    <Stack 
                        sx={{ 
                            padding: constant.padding, 
                            gap: constant.gap, 
                            flex: 1,
                            justifyContent: 'space-between'
                        }}
                    >
                        <Typography 
                            variant='h6' 
                            sx={{ 
                                fontSize: '1rem',
                                fontWeight: 600,
                                lineHeight: 1.2,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {meal.name}
                        </Typography>
                        
                        <Box sx={{display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', mt: 'auto'}}>
                            <ServesChip serves={meal.serves ?? 2} size={'small'}/>
                            <PrepTimeChip prepTimeMinutes={meal.prepTimeMinutes ?? 30} size={'small'}/>
                            <EffortChip effort={meal.effort} size={'small'}/>
                            <IngredientsStatusChip meal={meal} size={'small'}/>
                        </Box>
                    </Stack>
                </CardActionArea>
            </Card>
        </Fade>
    )
}