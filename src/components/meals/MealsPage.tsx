import MealList from "./MealList.tsx";
import {useMeals} from "../../hooks/meal/useMeals.ts";
import MealFilters from "./MealFilters.tsx";
import Grid from "@mui/material/Unstable_Grid2";
import SearchBar from "../common/SearchBar.tsx";
import {useState} from "react";
import MealFilter from "../../filter/MealFilter.ts";
import {Divider, Stack} from "@mui/material";
import {Add, Language, Tune} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material-next/Button";
import {useNavigate} from "react-router-dom";
import ImportFromRecipeDialog from "../dialog/ImportFromRecipeDialog.tsx";
import Meal from "../../domain/Meal.ts";

export default function MealsPage() {

    const {meals, loading, failed} = useMeals();

    const [filter, setFilter] : [filter : MealFilter, setFilter : any] = useState(new MealFilter({
        name: null,
        effort: [],
    }));

    const [filtersOpen, setFiltersOpen] = useState(true)
    const [importRecipeOpen, setImportRecipeOpen] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleMealOnClick = (meal: Meal) => navigate(`${meal.id}`)

    const handleNewMealOnClick = () => navigate("/meals/new");

    const handleImportRecipeOnClick = () => setImportRecipeOpen(true);

    return (
        <Grid container spacing={2}>
            <Grid sx={{display: {xs: 'none', md: 'block'}}} xs={12} md={3} lg={3} >
                <Stack direction='row' gap={1}>
                    <Button size='large' fullWidth variant='filledTonal' startIcon={<Add/>} sx={{borderRadius: 3, py: 2, display: {xs: 'none', md: 'flex'}}} onClick={handleNewMealOnClick}>
                        Meal
                    </Button>
                    <Button size='large' fullWidth variant='outlined' startIcon={<Language/>} sx={{borderRadius: 3, py: 2, display: {xs: 'none', md: 'flex'}}} onClick={handleImportRecipeOnClick}>
                        Import
                    </Button>
                </Stack>
                <Divider sx={{mt: 2, mb: 2}}/>
                <MealFilters filter={filter} setFilter={setFilter} open={filtersOpen} setOpen={setFiltersOpen}/>
                <ImportFromRecipeDialog open={importRecipeOpen} setOpen={setImportRecipeOpen} onConfirm={(newMeal) => navigate("/meals/new", {state: {newMeal: newMeal}})}/>
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
    )
}