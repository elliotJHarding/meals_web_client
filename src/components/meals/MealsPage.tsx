import MealList from "./MealList.tsx";
import {useMeals} from "../../hooks/meal/useMeals.ts";
import MealFilters from "./MealFilters.tsx";
import Grid from "@mui/material/Unstable_Grid2";
import SearchBar from "../common/SearchBar.tsx";
import {useState} from "react";
import MealFilter from "../../filter/MealFilter.ts";
import {Divider, Stack, Fab, useMediaQuery, useTheme} from "@mui/material";
import {Add, Tune} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material-next/Button";
import {useNavigate} from "react-router-dom";
import {MealDto} from "@elliotJHarding/meals-api";
import NewMealDialog from "../dialog/NewMealDialog.tsx";

export default function MealsPage() {

    const {meals, loading, failed} = useMeals();

    const [filter, setFilter] : [filter : MealFilter, setFilter : any] = useState(new MealFilter({
        name: null,
        effort: [],
    }));

    const [filtersOpen, setFiltersOpen] = useState(true)
    const [newMealOpen, setNewMealOpen] = useState<boolean>(false);

    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleMealOnClick = (meal: MealDto) => navigate(`${meal.id}`)

    const handleNewMealOnClick = () => setNewMealOpen(true);


    return (
        <>
            <Grid container spacing={2}>
                <Grid sx={{display: {xs: 'none', md: 'block'}}} xs={12} md={3} lg={3} >
                    <Stack direction='row' gap={1}>
                        <NewMealDialog open={newMealOpen} setOpen={setNewMealOpen}/>
                        <Button size='large' fullWidth variant='filledTonal' startIcon={<Add/>} sx={{borderRadius: 3, py: 2, display: {xs: 'none', md: 'flex'}}} onClick={handleNewMealOnClick}>
                            Meal
                        </Button>
                    </Stack>
                    <Divider sx={{mt: 2, mb: 2}}/>
                    <MealFilters filter={filter} setFilter={setFilter} open={filtersOpen} setOpen={setFiltersOpen}/>
                </Grid>
                <Grid xs={12} md={9} lg={6}>
                    <Stack sx={{mb: 2}} direction='row' gap={1} alignItems='center'>
                        <SearchBar searchValue={filter.criteria.name} onChange={(newValue : string) => setFilter(new MealFilter({...filter.criteria, name: newValue}))}/>
                        <IconButton size='large' sx={{display: {xs: 'block', md: 'none'}}}>
                            <Tune/>
                        </IconButton>
                    </Stack>
                    <MealList meals={filter.filter(meals)} loading={loading} failed={failed} mealOnClick={handleMealOnClick}/>
                </Grid>
            </Grid>

            {/* Mobile-only Floating Action Button */}
            {isMobile && (
                <Fab
                    onClick={handleNewMealOnClick}
                    variant='extended'
                    size='large'
                    sx={{
                        position: 'fixed',
                        bottom: 80, // Above mobile navbar (56px + 24px margin)
                        right: 16,
                        backgroundColor: theme.sys.color.secondaryContainer,
                        borderRadius: 3, // Consistent with existing button styling
                        '&:hover': {
                            transform: 'scale(1.05)',
                            backgroundColor: theme.sys.color.secondaryContainer,
                        },
                        transition: 'transform 0.2s ease-in-out',
                    }}
                    aria-label="Add new meal"
                ><Add sx={{mr: 1}}/>Meal</Fab>
            )}
        </>
    )
}