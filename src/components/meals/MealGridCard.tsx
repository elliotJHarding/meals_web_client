import Meal from "../../domain/Meal.ts";
import {Card, CardActionArea, CardMedia, Fade, Typography, Stack} from "@mui/material";
import EffortChip from "./chip/EffortChip.tsx";
import Box from "@mui/material/Box";
import PrepTimeChip from "./chip/PrepTimeChip.tsx";
import ServesChip from "./chip/ServesChip.tsx";

const constant = {
    padding: 1.5,
    gap: 1,
    imageHeight: 120,
    imageBorderRadius: 2,
    cardBorderRadius: 3,
}

export default function MealGridCard({meal, index, onClick} : {meal : Meal, index : number, onClick: (meal : Meal) => void}) {

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
                    <CardMedia
                        sx={{
                            height: constant.imageHeight, 
                            borderRadius: `${constant.imageBorderRadius}px ${constant.imageBorderRadius}px 0 0`,
                            flexShrink: 0
                        }}
                        image={meal.image?.url}
                    />
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
                            <ServesChip serves={meal.serves} size={'small'}/>
                            <PrepTimeChip prepTimeMinutes={meal.prepTimeMinutes} size={'small'}/>
                            <EffortChip effort={meal.effort} size={'small'}/>
                        </Box>
                    </Stack>
                </CardActionArea>
            </Card>
        </Fade>
    )
}