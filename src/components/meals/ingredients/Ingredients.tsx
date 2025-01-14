import {Ingredient, parseIngredient, shortFormat} from "../../../domain/Ingredient.ts";
import {Card, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material-next/Button";
import {Add, Close, ContentPaste, Edit, PlaylistAdd} from "@mui/icons-material";
import {useState} from "react";
import Meal from "../../../domain/Meal.ts";
import {useMealUpdate} from "../../../hooks/meal/useMealUpdate.ts";
import IngredientList from "./IngredientList.tsx";
import IngredientEditList from "./IngredientEditList.tsx";
import {useUnits} from "../../../hooks/unit/useUnits.ts";
import {AnimatePresence, motion} from "framer-motion";
import ConfirmCancelButtons from "../../common/ConfirmCancelButtons.tsx";
import IconButton from "@mui/material/IconButton";

const constant = {
    borderRadius: 3,
    cardPadding: 3
}

export type IngredientEdit = {
    id?: bigint;
    index : number,
    input : string,
}

export default function Ingredients({meal, setMeal, initialEdit}: { meal : Meal, setMeal : any, initialEdit : boolean}) {

    const {updateMeal} = useMealUpdate(() => {
        setEdit(false);
    });

    const {units} = useUnits()

    const [edit, setEdit] = useState(initialEdit)

    const resetIngredientEdits = (mealToReset : Meal) => mealToReset.ingredients.map(ingredient => ({
        id: ingredient.id,
        index: ingredient.index,
        input: shortFormat(ingredient)
    }));

    const [ingredientEdits, setIngredientEdits] =
        useState<IngredientEdit[]>(resetIngredientEdits(meal));

    const handleEditOnClick = () => {
        setEdit(true)
        ingredientEdits.length == 0 && addBlank();
    };

    const handleCancel = () => {
        setIngredientEdits(resetIngredientEdits(meal));
        setEdit(false);
    }

    const handlePaste = async () => {
        setEdit(true)
        const clipboardContent = await navigator.clipboard.read();

        for (const item of clipboardContent) {
            if (item.types.includes('text/plain')) {
                const blob = await item.getType('text/plain')
                const blobText = await blob.text();

                const lines = blobText.split('\n')
                const newIngredients : IngredientEdit[] = lines.map((line, index) => {
                    return {
                        index: ingredientEdits.length + index,
                        input: line
                    }
                })

                const filterBlanks = (edits: IngredientEdit[]) => edits.filter(edit => edit.input != '');

                setIngredientEdits([...filterBlanks(ingredientEdits), ...filterBlanks(newIngredients)]);
            }
        }
    }

    const handleConfirm = () => {
        const newIngredients: Ingredient[] = ingredientEdits
            .filter(edit => edit.input != '')
            .map(edit => parseIngredient(edit, units, meal))
            .filter(edit => edit != null)
            .map((ingredient, index) => ({...ingredient, index: index})) as Ingredient[];
        const newMeal = {...meal, ingredients: newIngredients};
        updateMeal(newMeal);
        setMeal(newMeal);
        setIngredientEdits(resetIngredientEdits(newMeal));
    }

    const addBlank = () => {
        setIngredientEdits(ingredientEdits.concat([{
            index: ingredientEdits.length,
            input: '',
        }]))
    }

    const displayButtons = meal.ingredients.length > 0 ?
        <Button startIcon={<Edit/>} onClick={handleEditOnClick}>Edit</Button> :
        <Button startIcon={<PlaylistAdd/>} onClick={handleEditOnClick}>Add Ingredients</Button>;

    const addButton =
        <Stack direction='row' sx={{width: {xs: '100%', md: '50%'}}}>
            <Button sx={{width: '100%', borderRadius: 1}} onClick={addBlank} startIcon={<Add/>} fullWidth variant='filledTonal' component={motion.div}
                    layout initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}}>Add</Button>
            <IconButton sx={{visibility: 'hidden'}}>
                <Close/>
            </IconButton>
        </Stack>

    return (
        <Card sx={{padding: constant.cardPadding, borderRadius: constant.borderRadius}} component={motion.div} layout>
            <Stack direction='row' alignItems='center' component={motion.div} layout>
                <Typography variant='h5'>
                    Ingredients
                </Typography>
                {edit && <Button startIcon={<ContentPaste/>} onClick={handlePaste}>Paste</Button>}
                <Box sx={{flexGrow: 1}}/>
                <AnimatePresence>
                    { edit ? <ConfirmCancelButtons handleConfirm={handleConfirm} handleCancel={handleCancel}/> : displayButtons }
                </AnimatePresence>
            </Stack>
            {meal.ingredients.length > 0 && !edit ? <IngredientList ingredients={meal.ingredients}/> : null}
            {ingredientEdits.length > 0 && edit ? <IngredientEditList ingredientEdits={ingredientEdits} setIngredientEdits={setIngredientEdits}/> : null}
            {edit ? addButton : null}
        </Card>
    )
}