import Meal from "../../domain/Meal.ts";
import {Dialog, Stack, useMediaQuery, useTheme, Typography, TextField, Select, FormControl, InputLabel, MenuItem, CircularProgress, Card, CardActionArea, CardMedia, Collapse} from "@mui/material";
import SearchBar from "../common/SearchBar.tsx";
import {useState, useEffect} from "react";
import MealList from "../meals/MealList.tsx";
import MealGrid from "../meals/MealGrid.tsx";
import {Box} from "@mui/material";
import Button from "@mui/material-next/Button";
import {Tab, Tabs, Slider, Chip} from "@mui/material-next"
import {RestaurantMenu, Kitchen, Add, ArrowBack, Remove, Person, Timer} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import IconButton from "@mui/material-next/IconButton";
import {useMealCreate} from "../../hooks/meal/useMealCreate.ts";
import {useTags} from "../../hooks/tags/useTags.ts";
import {formatPrepTime} from "../common/Utils.ts";
import Effort from "../../domain/Effort.ts";
import {AnimatePresence, motion} from "framer-motion";
import PrepTimeChip from "../meals/chip/PrepTimeChip.tsx";
import EffortChip from "../meals/chip/EffortChip.tsx";
import MealPlan from "../../domain/MealPlan.ts";
import Plan from "../../domain/Plan.ts";

export default function MealChooser({open, setOpen, onConfirm, meals, mealsLoading, mealsFailed, mealPlan, currentPlan}: {
    open: boolean,
    setOpen: (open: boolean) => void,
    onConfirm: (meal: Meal, servings: number, leftovers: boolean) => void,
    meals: Meal[]
    mealsLoading: boolean,
    mealsFailed: boolean,
    mealPlan?: MealPlan,
    currentPlan?: Plan
}) {

    const [searchValue, setSearchValue] = useState<string>('');
    const [tabValue, setTabValue] = useState(0);
    const [mobileView, setMobileView] = useState<'menu' | 'meals' | 'leftovers' | 'new'>('menu');
    const [leftoverServings, setLeftoverServings] = useState<Record<string, number>>({});
    const theme = useTheme();
    const isXsScreen = useMediaQuery(theme.breakpoints.only('xs'));
    const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // New meal form state
    const [newMeal, setNewMeal] = useState<Meal>({
        name: '',
        description: '',
        serves: 2,
        prepTimeMinutes: 30,
        ingredients: [],
        tags: []
    });

    // Debounced search for similar meals
    const [debouncedMealName, setDebouncedMealName] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedMealName(newMeal.name);
        }, 500);

        return () => clearTimeout(timer);
    }, [newMeal.name]);

    const {tags, findTag} = useTags();
    const {createMeal, loading: creatingMeal} = useMealCreate((createdMeal: Meal) => {
        // Reset form
        setNewMeal({
            name: '',
            description: '',
            serves: 2,
            prepTimeMinutes: 30,
            ingredients: [],
            tags: []
        });
        setDebouncedMealName('');
        // Close dialog and notify parent
        setOpen(false);
        onConfirm(createdMeal);
        setSearchValue('');
        setTabValue(0);
        setMobileView('menu');
    });

    const getPrecedingMeals = (): Meal[] => {
        if (!mealPlan || !currentPlan) return [];

        const precedingPlans = mealPlan.plans.filter(p =>
            p.date.getTime() < currentPlan.date.getTime()
        );

        const mealsMap = new Map<string, Meal>();
        precedingPlans.forEach(plan => {
            plan.planMeals?.forEach(planMeal => {
                if (planMeal.meal && planMeal.meal.id) {
                    mealsMap.set(planMeal.meal.id.toString(), planMeal.meal);
                }
            });
        });

        return Array.from(mealsMap.values());
    };

    const handleMealOnClick = (meal: Meal) => {
        setOpen(false);
        onConfirm(meal, meal.serves, false);
        setSearchValue('');
        setTabValue(0);
        setMobileView('menu');
        setLeftoverServings({});
    }

    const handleLeftoverClick = (meal: Meal) => {
        const mealId = meal.id?.toString() || meal.name;
        const servings = leftoverServings[mealId] || 1;
        setOpen(false);
        onConfirm(meal, servings, true);
        setSearchValue('');
        setTabValue(0);
        setMobileView('menu');
        setLeftoverServings({});
    };

    const getLeftoverServings = (meal: Meal): number => {
        const mealId = meal.id?.toString() || meal.name;
        return leftoverServings[mealId] || 1;
    };

    const setLeftoverServingsForMeal = (meal: Meal, servings: number) => {
        const mealId = meal.id?.toString() || meal.name;
        setLeftoverServings(prev => ({ ...prev, [mealId]: servings }));
    };

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

    // New meal form handlers
    const handleNameChange = (newName: string) => setNewMeal({...newMeal, name: newName});
    const handleDescriptionChange = (newDesc: string) => setNewMeal({...newMeal, description: newDesc});
    const handlePrepTimeChange = (newPrepTime: number) => setNewMeal({...newMeal, prepTimeMinutes: newPrepTime});
    const handleServesIncrease = () => newMeal.serves < 100 && setNewMeal({...newMeal, serves: newMeal.serves + 1});
    const handleServesDecrease = () => newMeal.serves > 1 && setNewMeal({...newMeal, serves: newMeal.serves - 1});
    const handleEffortChange = (newEffort: Effort | undefined) => setNewMeal({...newMeal, effort: newEffort});
    const handleTagsChange = (tagIds: number[]) => {
        setNewMeal({...newMeal, tags: tagIds.map(id => findTag(id)).filter(tag => tag !== undefined) as typeof newMeal.tags})
    };

    // Find similar meals based on debounced name
    const similarMeals = debouncedMealName.trim().length >= 2
        ? meals.filter(meal =>
            meal.name.toLowerCase().includes(debouncedMealName.toLowerCase().trim())
          ).slice(0, 3) // Show max 3 suggestions
        : [];

    const handleCreateMeal = () => {
        if (newMeal.name.trim().length === 0) {
            return; // Don't create if name is empty
        }
        createMeal(newMeal);
    };

    const handleCancelNewMeal = () => {
        // Reset form
        setNewMeal({
            name: '',
            description: '',
            serves: 2,
            prepTimeMinutes: 30,
            ingredients: [],
            tags: []
        });
        setDebouncedMealName('');
        // Go back to menu in mobile or switch to first tab in desktop
        if (isMobileScreen) {
            setMobileView('menu');
        } else {
            setTabValue(0);
        }
    };

    const handleCreateNewFromSearch = () => {
        // Pre-populate new meal with search term
        setNewMeal({
            ...newMeal,
            name: searchValue
        });
        // Navigate to new meal tab
        if (isMobileScreen) {
            setMobileView('new');
        } else {
            setTabValue(2);
        }
        // Clear search
        setSearchValue('');
    };

    const renderNewMealForm = () => (
        <Stack gap={2} sx={{ flex: 1 }}>
            <TextField
                label='Name'
                value={newMeal.name}
                autoComplete='off'
                onChange={(event) => handleNameChange(event.target.value)}
                required
                disabled={creatingMeal}
                autoFocus
            />
            <Collapse in={similarMeals.length > 0} timeout={300}>
                <Box sx={{ mb: 2 }}>
                    <Stack gap={1}>
                        <AnimatePresence mode="sync">
                            {similarMeals.map((meal, index) => (
                                <motion.div
                                    key={meal.id?.toString() || meal.name}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <CardActionArea onClick={() => handleMealOnClick(meal)}>
                                        <Card
                                            sx={{
                                                borderRadius: 3,
                                                p: 1,
                                                display: 'flex',
                                                gap: 1,
                                                border: '1px solid',
                                                borderColor: 'divider'
                                            }}
                                        >
                                            {meal.image?.url && (
                                                <CardMedia
                                                    sx={{ width: 80, height: 60, borderRadius: 2, flexShrink: 0 }}
                                                    image={meal.image.url}
                                                />
                                            )}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, py: 0.5, flex: 1, minWidth: 0 }}>
                                                <Typography variant='body2' fontWeight="medium" noWrap>
                                                    {meal.name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                    <PrepTimeChip prepTimeMinutes={meal.prepTimeMinutes} size={'small'}/>
                                                    {meal.effort && <EffortChip effort={meal.effort} size={'small'}/>}
                                                </Box>
                                            </Box>
                                        </Card>
                                    </CardActionArea>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </Stack>
                </Box>
            </Collapse>
            <TextField
                multiline
                rows={3}
                label="Description"
                value={newMeal.description}
                onChange={(event) => handleDescriptionChange(event.target.value)}
                disabled={creatingMeal}
            />
            <Stack spacing={1} direction='row' alignItems='center'>
                <Timer/>
                <Typography sx={{ minWidth: 60 }}>{formatPrepTime(newMeal.prepTimeMinutes)}</Typography>
                <Slider
                    step={5}
                    min={5}
                    marks
                    max={120}
                    value={newMeal.prepTimeMinutes}
                    onChange={(_event: Event, value: number | number[]) => handlePrepTimeChange(Array.isArray(value) ? value[0] : value)}
                    disabled={creatingMeal}
                    sx={{ flex: 1 }}
                />
            </Stack>
            <Stack spacing={1} direction='row' alignItems='center'>
                <IconButton size='small' onClick={handleServesDecrease} disabled={creatingMeal}>
                    <Remove/>
                </IconButton>
                <Person/>
                <Typography sx={{ minWidth: 20 }}>{newMeal.serves}</Typography>
                <IconButton size='small' onClick={handleServesIncrease} disabled={creatingMeal}>
                    <Add/>
                </IconButton>
                <FormControl fullWidth>
                    <InputLabel id="effort-label">Effort</InputLabel>
                    <Select
                        labelId="effort-label"
                        label="Effort"
                        value={newMeal.effort || ''}
                        onChange={(event) => handleEffortChange(event.target.value === '' ? undefined : event.target.value as Effort)}
                        disabled={creatingMeal}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="LOW">Low</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="HIGH">High</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            <FormControl fullWidth>
                <InputLabel id="tags-label">Tags</InputLabel>
                <Select
                    labelId="tags-label"
                    label="Tags"
                    multiple
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value: number) => (
                                <Chip key={value} label={findTag(value)?.name}/>
                            ))}
                        </Box>
                    )}
                    value={newMeal.tags.map(tag => tag.id)}
                    onChange={(event) => handleTagsChange(event.target.value as number[])}
                    disabled={creatingMeal}
                >
                    {tags.map(tag => <MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>)}
                </Select>
            </FormControl>
            <Stack direction='row' gap={2} justifyContent='flex-end' sx={{ mt: 2 }}>
                <Button
                    variant='text'
                    onClick={handleCancelNewMeal}
                    disabled={creatingMeal}
                >
                    Cancel
                </Button>
                <Button
                    variant='filled'
                    onClick={handleCreateMeal}
                    disabled={creatingMeal || newMeal.name.trim().length === 0}
                    startIcon={creatingMeal ? <CircularProgress size={16} /> : undefined}
                >
                    {creatingMeal ? 'Creating...' : similarMeals.length > 0 ? 'Create New Anyway' : 'Create Meal'}
                </Button>
            </Stack>
        </Stack>
    );

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
            case 'meals': {
                const filteredMealsMobile = meals.filter(meal => meal.name.toLowerCase().includes(searchValue.toLowerCase()));
                const hasNoResultsMobile = !mealsLoading && !mealsFailed && filteredMealsMobile.length === 0 && searchValue.trim().length > 0;

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
                        {hasNoResultsMobile ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 4,
                                textAlign: 'center'
                            }}>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                    No meals found for "{searchValue}"
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Create a new meal with this name?
                                </Typography>
                                <Button
                                    variant="filled"
                                    startIcon={<Add />}
                                    onClick={handleCreateNewFromSearch}
                                >
                                    Create New Meal
                                </Button>
                            </Box>
                        ) : (
                            <MealList meals={filteredMealsMobile} loading={mealsLoading} failed={mealsFailed} mealOnClick={handleMealOnClick}/>
                        )}
                    </Stack>
                );
            }
            case 'leftovers': {
                const precedingMealsMobile = getPrecedingMeals();
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
                        {!mealPlan || !currentPlan ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    Open from a plan to use leftovers
                                </Typography>
                            </Box>
                        ) : precedingMealsMobile.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    No meals from previous days
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Plan some meals on earlier dates to add them as leftovers
                                </Typography>
                            </Box>
                        ) : (
                            <Stack gap={1}>
                                {precedingMealsMobile.map(meal => renderLeftoverItem(meal))}
                            </Stack>
                        )}
                    </Stack>
                );
            }
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
                        {renderNewMealForm()}
                    </Stack>
                );
            default:
                return null;
        }
    };

    const renderLeftoverItem = (meal: Meal) => {
        const servings = getLeftoverServings(meal);

        return (
            <Card
                key={meal.id?.toString() || meal.name}
                sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                        boxShadow: 2
                    }
                }}
            >
                <Stack direction="row" gap={2} sx={{ p: 2 }} alignItems="center">
                    {/* Meal Image */}
                    {meal?.image?.url ? (
                        <CardMedia
                            image={meal.image.url}
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                backgroundSize: 'cover',
                                flexShrink: 0
                            }}
                        />
                    ) : (
                        <Box sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            backgroundColor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <RestaurantMenu sx={{ fontSize: 28, color: 'grey.400' }} />
                        </Box>
                    )}

                    {/* Meal Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" fontWeight={500} noWrap>
                            {meal.name} Leftovers
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                            <PrepTimeChip prepTimeMinutes={meal.prepTimeMinutes} size={'small'}/>
                            {meal.effort && <EffortChip effort={meal.effort} size={'small'}/>}
                        </Box>
                    </Box>

                    {/* Portions Selector */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
                        <Person fontSize="small" />
                        <IconButton
                            size="small"
                            onClick={() => setLeftoverServingsForMeal(meal, Math.max(1, servings - 1))}
                        >
                            <Remove fontSize="small" />
                        </IconButton>
                        <Typography sx={{ minWidth: '2ch', textAlign: 'center' }}>{servings}</Typography>
                        <IconButton
                            size="small"
                            onClick={() => setLeftoverServingsForMeal(meal, servings + 1)}
                        >
                            <Add fontSize="small" />
                        </IconButton>
                    </Stack>

                    {/* Add Button */}
                    <Button
                        variant="filled"
                        onClick={() => handleLeftoverClick(meal)}
                        sx={{ flexShrink: 0 }}
                    >
                        Add
                    </Button>
                </Stack>
            </Card>
        );
    };

    const renderTabContent = () => {
        switch (tabValue) {
            case 0: {
                const filteredMeals = meals.filter(meal => meal.name.toLowerCase().includes(searchValue.toLowerCase()));
                const hasNoResults = !mealsLoading && !mealsFailed && filteredMeals.length === 0 && searchValue.trim().length > 0;

                return (
                    <Stack gap={2} sx={{ flex: 1 }}>
                        <SearchBar searchValue={searchValue} onChange={setSearchValue}/>
                        {hasNoResults ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 4,
                                textAlign: 'center',
                                flex: 1
                            }}>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                    No meals found for "{searchValue}"
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Create a new meal with this name?
                                </Typography>
                                <Button
                                    variant="filled"
                                    startIcon={<Add />}
                                    onClick={handleCreateNewFromSearch}
                                >
                                    Create New Meal
                                </Button>
                            </Box>
                        ) : isXsScreen ? (
                            <MealList meals={filteredMeals} loading={mealsLoading} failed={mealsFailed} mealOnClick={handleMealOnClick}/>
                        ) : (
                            <MealGrid meals={filteredMeals} loading={mealsLoading} failed={mealsFailed} mealOnClick={handleMealOnClick}/>
                        )}
                    </Stack>
                );
            }
            case 1: {
                const precedingMeals = getPrecedingMeals();
                return (
                    <Stack gap={2} sx={{ flex: 1 }}>
                        {!mealPlan || !currentPlan ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    Open from a plan to use leftovers
                                </Typography>
                            </Box>
                        ) : precedingMeals.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    No meals from previous days
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Plan some meals on earlier dates to add them as leftovers
                                </Typography>
                            </Box>
                        ) : (
                            <Stack gap={1}>
                                {precedingMeals.map(meal => renderLeftoverItem(meal))}
                            </Stack>
                        )}
                    </Stack>
                );
            }
            case 2:
                return renderNewMealForm();
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
                setNewMeal({
                    name: '',
                    description: '',
                    serves: 2,
                    prepTimeMinutes: 30,
                    ingredients: [],
                    tags: []
                })
                setDebouncedMealName('')
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