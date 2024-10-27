import Meal from "../../domain/Meal.ts";
import {Dialog, Stack} from "@mui/material";
import SearchBar from "../common/SearchBar.tsx";
import {useState} from "react";
import MealList from "../meals/MealList.tsx";

export default function MealChooser({open, setOpen, onConfirm, meals, mealsLoading, mealsFailed}: {
    open: boolean,
    setOpen: any,
    onConfirm: (meal: Meal) => void,
    meals: Meal[]
    mealsLoading: boolean,
    mealsFailed: boolean,
}) {

    const [searchValue, setSearchValue] = useState<string>('');

    const handleMealOnClick = (meal: Meal) => {
        setOpen(false);
        onConfirm(meal);
        setSearchValue('')
    }

    return (
        <Dialog open={open} onBackdropClick={() => setOpen(false)}>
            <Stack gap={2}>
                <SearchBar searchValue={searchValue} onChange={setSearchValue}/>
                <MealList meals={meals.filter(meal => meal.name.toLowerCase().includes(searchValue.toLowerCase()))} loading={mealsLoading} failed={mealsFailed} mealOnClick={handleMealOnClick}/>
            </Stack>
        </Dialog>
    )
}