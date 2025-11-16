import {Card, CardMedia, Stack, Typography, Box, Chip, useTheme} from "@mui/material";
import { RestaurantMenu, Add } from "@mui/icons-material";
import { motion } from "framer-motion";
import SuggestedMeal from "../../../../../domain/ai/SuggestedMeal.ts";
import IconButton from "@mui/material-next/IconButton";

interface SuggestedMealCardProps {
    suggestedMeal: SuggestedMeal;
    onAddMeal: (suggestedMeal: SuggestedMeal) => void;
}

export default function SuggestedMealCard({ suggestedMeal, onAddMeal }: SuggestedMealCardProps) {
    const { meal } = suggestedMeal;

    const theme = useTheme();

    return (
        <Card
            component={motion.div}
            layout
            sx={{
                backgroundColor: 'transparent',
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 2,
                transition: 'all 0.2s',
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
            <Stack direction="row" gap={1} alignItems="center" sx={{ p: 1 }}>
                {/* Meal Image/Icon */}
                {meal?.image?.url ? (
                    <CardMedia
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            flexShrink: 0,
                            backgroundSize: 'cover'
                        }}
                        image={meal.image.url}
                    />
                ) : (
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            flexShrink: 0,
                            backgroundColor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <RestaurantMenu sx={{ fontSize: 20, color: 'grey.400' }} />
                    </Box>
                )}

                <Typography
                    noWrap
                    sx={{ fontWeight: 500 }}
                >
                    {meal?.name}
                </Typography>

                <Box flexGrow={1} />

                {/* Add Button */}
                <IconButton
                    size="small"
                    sx={{
                        backgroundColor: theme.sys.color.tertiary,
                        color: theme.sys.color.onPrimary,
                    }}
                >
                    <Add fontSize="small" />
                </IconButton>
            </Stack>
        </Card>
    );
}
