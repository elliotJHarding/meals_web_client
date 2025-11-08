import { Card, CardMedia, Stack, Typography, Box, Chip } from "@mui/material";
import { RestaurantMenu, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import SuggestedMeal from "../../../../../domain/ai/SuggestedMeal.ts";
import IconButton from "@mui/material-next/IconButton";

interface SuggestedMealCardProps {
    suggestedMeal: SuggestedMeal;
    onAddMeal: (suggestedMeal: SuggestedMeal) => void;
}

export default function SuggestedMealCard({ suggestedMeal, onAddMeal }: SuggestedMealCardProps) {
    const { meal, rank, suitability_score } = suggestedMeal;

    // Format suitability score as percentage
    const scorePercent = Math.round(suitability_score * 100);

    return (
        <Card
            component={motion.div}
            layout
            sx={{
                backgroundColor: 'secondaryContainer',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                    boxShadow: 2,
                    borderColor: 'primary.main'
                }
            }}
        >
            <Stack sx={{ p: 1.5 }} spacing={1}>
                {/* Top Row: Image and Info */}
                <Stack direction="row" gap={1.5} alignItems="center">
                    {/* Meal Image/Icon */}
                    {meal?.image?.url ? (
                        <CardMedia
                            sx={{
                                width: 50,
                                height: 50,
                                borderRadius: 1,
                                flexShrink: 0,
                                backgroundSize: 'cover'
                            }}
                            image={meal.image.url}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: 50,
                                height: 50,
                                borderRadius: 1,
                                flexShrink: 0,
                                backgroundColor: 'grey.100',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <RestaurantMenu sx={{ fontSize: 24, color: 'grey.400' }} />
                        </Box>
                    )}

                    <Stack sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 500 }}
                        >
                            {meal?.name}
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                            <Chip
                                label={`#${rank}`}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    backgroundColor: 'primary.main',
                                    color: 'white'
                                }}
                            />
                            <Chip
                                label={`${scorePercent}%`}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    backgroundColor: scorePercent >= 80 ? 'success.light' : scorePercent >= 60 ? 'warning.light' : 'grey.300'
                                }}
                            />
                        </Stack>
                    </Stack>

                    {/* Add Button */}
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddMeal(suggestedMeal);
                        }}
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'primary.dark'
                            }
                        }}
                    >
                        <Add fontSize="small" />
                    </IconButton>
                </Stack>

                {/* Meal Description (if short enough) */}
                {meal?.description && meal.description.length < 60 && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {meal.description}
                    </Typography>
                )}
            </Stack>
        </Card>
    );
}
