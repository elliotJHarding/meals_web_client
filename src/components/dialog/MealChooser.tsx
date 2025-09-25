import Meal from "../../domain/Meal.ts";
import {Dialog, Stack, useMediaQuery, useTheme, Typography} from "@mui/material";
import SearchBar from "../common/SearchBar.tsx";
import {useState} from "react";
import MealList from "../meals/MealList.tsx";
import MealGrid from "../meals/MealGrid.tsx";
import {Box} from "@mui/material";
import Button from "@mui/material-next/Button";
import {Tab, Tabs} from "@mui/material-next"
import {RestaurantMenu, Kitchen, Add, ArrowBack} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";

export default function MealChooser({open, setOpen, onConfirm, meals, mealsLoading, mealsFailed}: {
    open: boolean,
    setOpen: (open: boolean) => void,
    onConfirm: (meal: Meal) => void,
    meals: Meal[]
    mealsLoading: boolean,
    mealsFailed: boolean
}) {

    const [searchValue, setSearchValue] = useState<string>('');
    const [tabValue, setTabValue] = useState(0);
    const [mobileView, setMobileView] = useState<'menu' | 'meals' | 'leftovers' | 'new'>('menu');
    const theme = useTheme();
    const isXsScreen = useMediaQuery(theme.breakpoints.only('xs'));
    const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMealOnClick = (meal: Meal) => {
        setOpen(false);
        onConfirm(meal);
        setSearchValue('');
        setTabValue(0);
        setMobileView('menu');
    }

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setSearchValue('');
    };

    const handleMobileViewChange = (view: 'menu' | 'meals' | 'leftovers' | 'new') => {
        setMobileView(view);
        setSearchValue('');
    };

    const handleBackToMenu = () => {
        setMobileView('menu');
        setSearchValue('');
    };

    const renderMobileButtons = () => (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<RestaurantMenu />}
                    onClick={() => handleMobileViewChange('meals')}
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
            <Grid xs={12}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Kitchen />}
                    onClick={() => handleMobileViewChange('leftovers')}
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
            <Grid xs={12}>
                <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Add />}
                    onClick={() => handleMobileViewChange('new')}
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

    const renderMobileContent = () => {
        switch (mobileView) {
            case 'menu':
                return renderMobileButtons();
            case 'meals':
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
                                Choose Meal
                            </Typography>
                        </Stack>
                        <SearchBar searchValue={searchValue} onChange={setSearchValue}/>
                        <MealList meals={meals.filter(meal => meal.name.toLowerCase().includes(searchValue.toLowerCase()))} loading={mealsLoading} failed={mealsFailed} mealOnClick={handleMealOnClick}/>
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

    const renderTabContent = () => {
        switch (tabValue) {
            case 0:
                return (
                    <Stack gap={2} sx={{ flex: 1 }}>
                        <SearchBar searchValue={searchValue} onChange={setSearchValue}/>
                        {isXsScreen ? (
                            <MealList meals={meals.filter(meal => meal.name.toLowerCase().includes(searchValue.toLowerCase()))} loading={mealsLoading} failed={mealsFailed} mealOnClick={handleMealOnClick}/>
                        ) : (
                            <MealGrid meals={meals.filter(meal => meal.name.toLowerCase().includes(searchValue.toLowerCase()))} loading={mealsLoading} failed={mealsFailed} mealOnClick={handleMealOnClick}/>
                        )}
                    </Stack>
                );
            case 1:
                return (
                    <Stack gap={2} sx={{ flex: 1, p: 4, textAlign: 'center' }}>
                        <Typography variant="h6">Add Leftovers</Typography>
                        <Typography color="text.secondary">
                            Leftovers functionality coming soon...
                        </Typography>
                    </Stack>
                );
            case 2:
                return (
                    <Stack gap={2} sx={{ flex: 1, p: 4, textAlign: 'center' }}>
                        <Typography variant="h6">Create New Meal</Typography>
                        <Typography color="text.secondary">
                            New meal creation coming soon...
                        </Typography>
                    </Stack>
                );
            default:
                return null;
        }
    };


    return (
        <Dialog 
            open={open} 
            onClose={() => {
                setOpen(false)
                setSearchValue('')
                setTabValue(0)
                setMobileView('menu')
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
                    padding: isMobileScreen ? 3 : 0
                }
            }}
        >
            {isMobileScreen ? (
                <Box sx={{ minHeight: mobileView === 'menu' ? 200 : 400 }}>
                    {renderMobileContent()}
                </Box>
            ) : (
                <Box sx={{ display: 'flex', height: 500 }}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                            minWidth: 200,
                            '& .MuiTabs-indicator': {
                                left: 0,
                            }
                        }}
                    >
                        <Tab
                            icon={<RestaurantMenu />}
                            iconPosition="start"
                            label="Choose Meal"
                            sx={{
                                minHeight: 80,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                fontSize: '1rem',
                                textAlign: 'left'
                            }}
                        />
                        <Tab
                            icon={<Kitchen />}
                            iconPosition="start"
                            label="Add Leftovers"
                            sx={{
                                minHeight: 80,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                fontSize: '1rem',
                                textAlign: 'left'
                            }}
                        />
                        <Tab
                            icon={<Add />}
                            iconPosition="start"
                            label="New Meal"
                            sx={{
                                minHeight: 80,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                fontSize: '1rem',
                                textAlign: 'left'
                            }}
                        />
                    </Tabs>
                    <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                        {renderTabContent()}
                    </Box>
                </Box>
            )}
        </Dialog>
    )
}