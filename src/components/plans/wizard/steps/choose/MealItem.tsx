import { Card, CardMedia, IconButton, Stack, TextField, Typography, InputAdornment, useMediaQuery, useTheme } from "@mui/material";
import {Add, Remove, Delete, NotesRounded, Person} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState } from "react";
import PlanMeal from "../../../../../domain/PlanMeal.ts";
import { useNavigate } from "react-router-dom";

interface MealItemProps {
    planMeal: PlanMeal;
    onServingsChange: (newServings: number) => void;
    onNoteChange: (newNote: string) => void;
    onRemove: () => void;
}

export default function MealItem({ planMeal, onServingsChange, onNoteChange, onRemove }: MealItemProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [servings, setServings] = useState(planMeal.requiredServings);
    const [note, setNote] = useState(planMeal.note || "");

    const handleServingsChange = (newServings: number) => {
        if (newServings < 1) return;
        setServings(newServings);
        onServingsChange(newServings);
    };

    const handleNoteChange = (newNote: string) => {
        setNote(newNote);
        onNoteChange(newNote);
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
            <Stack sx={{ p: 1.5 }}>
                {/* Top Row: Image and Info */}
                <Stack direction="row" gap={2} alignItems="center">
                    {/* Meal Image and Info */}
                    <CardMedia
                        sx={{
                            width: 70,
                            height: 60,
                            borderRadius: 1.5,
                            cursor: 'pointer',
                            flexShrink: 0,
                            backgroundColor: planMeal.meal?.image?.url ? 'transparent' : 'grey.200',
                            backgroundSize: 'cover'
                        }}
                        image={planMeal.meal?.image?.url || '/placeholder-meal.png'}
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

                        <TextField
                            size="small"
                            placeholder="Add a note..."
                            value={note}
                            onChange={(e) => handleNoteChange(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NotesRounded sx={{ fontSize: '0.875rem', opacity: 0.7 }} />
                                    </InputAdornment>
                                ),
                                sx: { fontSize: '0.875rem', height: '32px', py: 0, pl: 0.5 }
                            }}
                            sx={{ 
                                mt: 0.5,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                    '&:hover fieldset': {
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    },
                                    '&.Mui-focused fieldset': {
                                        border: '1px solid',
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                    </Stack>

                    {/* Desktop-only controls */}
                    {!isMobile && (
                        <>
                            {/* Servings Controls */}
                            <Stack direction="row" alignItems="center" gap={0.5} sx={{ flexShrink: 0 }}>
                                <Person/>
                                <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                                    Portions
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
                        </>
                    )}
                </Stack>

                {/* Mobile-only bottom row: Controls */}
                {isMobile && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                        {/* Servings Controls */}
                        <Stack direction="row" alignItems="center" gap={0.5}>
                            <Person/>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
                                Portions
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
                            sx={{ p: 0.5 }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Stack>
                )}
            </Stack>
        </Card>
    );
}