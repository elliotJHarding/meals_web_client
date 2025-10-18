import {useNavigate, useParams} from "react-router-dom";
import {useMeal} from "../../hooks/meal/useMeal.ts";
import {Fade, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import MealDetails from "./MealDetails.tsx";
import Button from "@mui/material-next/Button";
import {ArrowBackIos, Delete, WarningRounded} from "@mui/icons-material";
import Ingredients from "./ingredients/Ingredients.tsx";
import {LayoutGroup} from "framer-motion";
import DeleteDialog from "../dialog/DeleteDialog.tsx";
import {useState} from "react";
import Error from "../error/Error.tsx";
import {useMealDelete} from "../../hooks/meal/useMealDelete.ts";

export default function MealPage() {

    const { mealId } = useParams();

    const {meal, setMeal, newMeal, setNewMeal, loading, failed} = useMeal(mealId);

    const {deleteMeal, loading: deleting} = useMealDelete();

    const navigate = useNavigate();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleBackOnClick = () => navigate(-1);

    const handleDeleteOnClick = () => setDeleteDialogOpen(true);

    const handleDelete = () => {
        if (meal?.id) {
            deleteMeal(meal.id, () => {
                setDeleteDialogOpen(false);
                navigate('/meals');
            });
        }
    };

    const mealElement = meal == null || newMeal == null ? null :
        <Fade in timeout={500}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <LayoutGroup>
                    <MealDetails meal={meal} setMeal={setMeal} newMeal={newMeal} setNewMeal={setNewMeal} initialEdit={mealId == 'new'} mealId={mealId} loading={loading}/>
                    <Ingredients key={meal.id} meal={meal} setMeal={setMeal} initialEdit={false}/>
                </LayoutGroup>
            </Box>
        </Fade>;

    return (
        <>
            <DeleteDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} onDelete={handleDelete}/>
            <Stack direction='row' sx={{pb: 1}}>
                <Button startIcon={<ArrowBackIos/>} onClick={handleBackOnClick}>Back</Button>
                <Box sx={{flexGrow: 1}}/>
                <Button
                    startIcon={<Delete/>}
                    onClick={handleDeleteOnClick}
                    disabled={mealId === 'new' || deleting}
                >
                    Delete
                </Button>
            </Stack>
            {failed ? <Error message={"Error loading meal"} icon={<WarningRounded fontSize="large"/>}/> : mealElement}
        </>
    )
}