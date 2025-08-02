import { Card, CardMedia, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState } from "react";
import PlanMeal from "../../../../../domain/PlanMeal.ts";
import { useNavigate } from "react-router-dom";

interface MealItemProps {
    planMeal: PlanMeal;
    onServingsChange: (newServings: number) => void;
    onRemove: () => void;
}

export default function MealItem({ planMeal, onServingsChange, onRemove }: MealItemProps) {
    const navigate = useNavigate();
    const [servings, setServings] = useState(planMeal.requiredServings);

    const handleServingsChange = (newServings: number) => {
        if (newServings < 1) return;
        setServings(newServings);
        onServingsChange(newServings);
    };

    const handleMealClick = () => {
        navigate(`/meals/${planMeal.meal.id}`);
    };

    return (
        <Card 
            component={motion.div}
            layout
            sx={{ 
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': {
                    boxShadow: 1
                }
            }}
        >
            <Stack direction="row" gap={2} sx={{ p: 1.5 }} alignItems="center">
                {/* Meal Image and Info */}
                <CardMedia
                    sx={{
                        width: 50,
                        height: 40,
                        borderRadius: 1.5,
                        cursor: 'pointer',
                        flexShrink: 0
                    }}
                    image={planMeal.meal?.image?.url}
                    onClick={handleMealClick}
                />
                
                <Stack sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                        variant="subtitle1" 
                        noWrap 
                        sx={{ cursor: 'pointer', fontWeight: 500 }}
                        onClick={handleMealClick}
                    >
                        {planMeal.meal?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Original: {planMeal.meal?.serves} servings
                    </Typography>
                </Stack>

                {/* Servings Controls */}
                <Stack direction="row" alignItems="center" gap={0.5} sx={{ flexShrink: 0 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                        Servings:
                    </Typography>
                    <IconButton 
                        size="small" 
                        onClick={() => handleServingsChange(servings - 1)}
                        disabled={servings <= 1}
                        sx={{ p: 0.5 }}
                    >
                        <Remove fontSize="small" />
                    </IconButton>
                    <TextField
                        size="small"
                        value={servings}
                        onChange={(e) => handleServingsChange(parseInt(e.target.value) || 1)}
                        inputProps={{ 
                            style: { textAlign: 'center', width: '32px', padding: '4px' },
                            min: 1,
                            type: 'number'
                        }}
                        sx={{ 
                            width: '48px',
                            '& .MuiOutlinedInput-root': {
                                height: '32px'
                            }
                        }}
                    />
                    <IconButton 
                        size="small" 
                        onClick={() => handleServingsChange(servings + 1)}
                        sx={{ p: 0.5 }}
                    >
                        <Add fontSize="small" />
                    </IconButton>
                </Stack>

                {/* Remove Button */}
                <IconButton 
                    size="small" 
                    color="error" 
                    onClick={onRemove}
                    sx={{ p: 0.5, ml: 0.5 }}
                >
                    <Delete fontSize="small" />
                </IconButton>
            </Stack>
        </Card>
    );
}