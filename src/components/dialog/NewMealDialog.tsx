import {
    Dialog,
    DialogContent,
    Stack,
} from "@mui/material";
import {Edit, LanguageOutlined} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import MealImport from "../meals/MealImport.tsx";

export default function NewMealDialog({open, setOpen} : {open : boolean, setOpen : any}) {

    const navigate = useNavigate();

    const [importMeal, setImportMeal] = useState<boolean>();

    const createNewMeal = () => navigate("/meals/new");

    const handleImportRecipeOnClick = () => setImportMeal(true);

    const handleBackdropClick = () => {
        setOpen(false)
        setImportMeal(false);
    };


    const ChooseMethod = () =>
        <Stack gap={2} direction="column">
            <Button sx={{borderRadius: 4, padding: 4}} variant='filledTonal' startIcon={<Edit/>} onClick={createNewMeal}>Blank Meal</Button>
            <Button sx={{borderRadius: 4, padding: 4}} variant='outlined' startIcon={<LanguageOutlined/>} onClick={handleImportRecipeOnClick}>Import from URL</Button>
        </Stack>

    return (
        <Dialog open={open} onBackdropClick={handleBackdropClick}>
            <DialogContent>
                {!importMeal && <ChooseMethod/>}
                {importMeal && <MealImport/>}
            </DialogContent>
        </Dialog>
    )
}