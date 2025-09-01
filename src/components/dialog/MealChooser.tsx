import Meal from "../../domain/Meal.ts";
import {Dialog, Stack, useMediaQuery, useTheme, Typography} from "@mui/material";
import SearchBar from "../common/SearchBar.tsx";
import {useState} from "react";
import MealList from "../meals/MealList.tsx";
import MealGrid from "../meals/MealGrid.tsx";
import {Box} from "@mui/material";
import Button from "@mui/material-next/Button";
import {RestaurantMenu, Kitchen, Add, ArrowBack} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";

export default function MealChooser({open, setOpen, onConfirm, meals, mealsLoading, mealsFailed}: {
    open: boolean,
    setOpen: any,
    onConfirm: (meal: Meal) => void,
    meals: Meal[]
    mealsLoading: boolean,
    mealsFailed: boolean,
}) {

    const [searchValue, setSearchValue] = useState<string>('');
    const [currentView, setCurrentView] = useState<'menu' | 'meals' | 'leftovers' | 'new'>('menu');
    const theme = useTheme();
    const isXsScreen = useMediaQuery(theme.breakpoints.only('xs'));

    const handleMealOnClick = (meal: Meal) => {
        setOpen(false);
        onConfirm(meal);
        setSearchValue('');
        setCurrentView('menu');
    }

    const handleBackToMenu = () => {
        setCurrentView('menu');
        setSearchValue('');
    };

    const renderMenuButtons = () => (
        <Grid container spacing={2}>
            <Grid xs={4}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<RestaurantMenu />}
                    onClick={() => setCurrentView('meals')}
                    sx={{
                        py: 8,
                        width: '100%',
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    Choose Meal
                </Button>

            </Grid>

            <Grid xs={4}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Kitchen />}
                    onClick={() => setCurrentView('leftovers')}
                    sx={{
                        py: 8,
                        width: '100%',
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    Add Leftovers
                </Button>
            </Grid>

            <Grid xs={4}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => setCurrentView('new')}
                    sx={{
                        py: 8,
                        width: '100%',
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    New Meal
                </Button>
            </Grid>

        </Grid>
    );

    const renderViewContent = () => {
        switch (currentView) {
            case 'menu':
                return renderMenuButtons();
            case 'meals':
                return (
                    <Stack gap={2}>
                        <SearchBar searchValue={searchValue} onChange={setSearchValue}/>
                        {isXsScreen ? (
                            <MealList meals={meals.filter(meal => meal.name.toLowerCase().includes(searchValue.toLowerCase()))} loading={mealsLoading} failed={mealsFailed} mealOnClick={handleMealOnClick}/>
                        ) : (
                            <MealGrid meals={meals.filter(meal => meal.name.toLowerCase().includes(searchValue.toLowerCase()))} loading={mealsLoading} failed={mealsFailed} mealOnClick={handleMealOnClick}/>
                        )}
                    </Stack>
                );
            case 'leftovers':
                return (
                    <Stack gap={2}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                startIcon={<ArrowBack />}
                                onClick={handleBackToMenu}
                                sx={{ textTransform: 'none' }}
                            >
                                Back
                            </Button>
                            <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
                                Add Leftovers
                            </Typography>
                        </Stack>
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Leftovers functionality coming soon...
                            </Typography>
                        </Box>
                    </Stack>
                );
            case 'new':
                return (
                    <Stack gap={2}>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                startIcon={<ArrowBack />}
                                onClick={handleBackToMenu}
                                sx={{ textTransform: 'none' }}
                            >
                                Back
                            </Button>
                            <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
                                Create New Meal
                            </Typography>
                        </Stack>
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                New meal creation coming soon...
                            </Typography>
                        </Box>
                    </Stack>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog 
            open={open} 
            onBackdropClick={() => {
                setOpen(false)
                setSearchValue('')
                setCurrentView('menu')
            }}
            PaperProps={{
                sx: {
                    minWidth: {
                        xs: '90vw',
                        sm: '600px',
                        md: '800px',
                        lg: '900px'
                    },
                    maxHeight: '85vh',
                    borderRadius: 5,
                    padding: 3
                }
            }}
        >
            <Box sx={{ minHeight: currentView === 'menu' ? 200 : 400 }}>
                {renderViewContent()}
            </Box>
        </Dialog>
    )
}