import {Card, CardMedia, Stack, Typography, Box, Chip, useTheme} from "@mui/material";
import { RestaurantMenu, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import {SuggestedMeal, MealDto} from "@elliotJHarding/meals-api";
import IconButton from "@mui/material-next/IconButton";

interface SuggestedMealCardProps {
    suggestedMeal: SuggestedMeal;
    meals: MealDto[];
    onAddMeal: (suggestedMeal: SuggestedMeal) => void;
}

export default function SuggestedMealCard({ suggestedMeal, meals, onAddMeal }: SuggestedMealCardProps) {
    // Look up the full meal object using mealId
    const meal = meals.find(m => m.id === suggestedMeal.mealId);

    const theme = useTheme();

    return (
        <Card
            component={motion.div}
            layout
            sx={{
                backgroundColor: 'transparent',
                border: '1px dashed',
                borderColor: 'grey.300',
                borderRadius: 1.5,
                transition: 'all 0.2s',
                cursor: 'pointer',
                '&:hover': {
                    borderColor: theme.sys.color.tertiary,
                    backgroundColor: 'grey.50'
                }
            }}
            onClick={(e) => {
                e.stopPropagation();
                onAddMeal(suggestedMeal);
            }}
        >
            <Stack direction="row" gap={0.75} alignItems="center" sx={{ px: 0.75, py: 0.5 }}>
                {/* Meal Image/Icon */}
                {meal?.image?.url ? (
                    <CardMedia
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 0.75,
                            flexShrink: 0,
                            backgroundSize: 'cover'
                        }}
                        image={meal.image.url}
                    />
                ) : (
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 0.75,
                            flexShrink: 0,
                            backgroundColor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <RestaurantMenu sx={{ fontSize: 16, color: 'grey.400' }} />
                    </Box>
                )}

                <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 500 }}
                >
                    {suggestedMeal.mealName || meal?.name}
                </Typography>

                <Box flexGrow={1} />

                {/* Add Button */}
                <IconButton
                    size="small"
                    sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: theme.sys.color.tertiary,
                        color: theme.sys.color.onPrimary,
                    }}
                >
                    <Add sx={{ fontSize: 16 }} />
                </IconButton>
            </Stack>
        </Card>
    );
}
