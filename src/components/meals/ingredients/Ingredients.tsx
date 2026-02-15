import {Card, CircularProgress, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material-next/Button";
import {Add, AutoAwesome, Close, ContentPaste, Edit, PlaylistAdd} from "@mui/icons-material";
import {useState} from "react";
import {MealDto, IngredientDto, SuggestedIngredient} from "@elliotJHarding/meals-api";
import {useMealUpdate} from "../../../hooks/meal/useMealUpdate.ts";
import IngredientList from "./IngredientList.tsx";
import IngredientEditList from "./IngredientEditList.tsx";
import SuggestedIngredientsList from "./SuggestedIngredientsList.tsx";
import {useUnits} from "../../../hooks/unit/useUnits.ts";
import {useAiSuggestIngredients} from "../../../hooks/ai/useAiSuggestIngredients.ts";
import {AnimatePresence, motion} from "framer-motion";
import ConfirmCancelButtons from "../../common/ConfirmCancelButtons.tsx";
import IconButton from "@mui/material/IconButton";
import {IngredientEdit} from "../../../types/IngredientEdit.ts";
import {parseIngredient, shortFormat} from "../../../utils/IngredientUtils.ts";

const constant = {
    borderRadius: 3,
    cardPadding: 3
}

export default function Ingredients({meal, setMeal, initialEdit}: { meal : MealDto, setMeal : any, initialEdit : boolean}) {

    const {updateMeal} = useMealUpdate(() => {
        setEdit(false);
    });

    const {units} = useUnits()
    const {suggestions, reasoning, isLoading: aiLoading, suggestIngredients, clearSuggestions, removeSuggestion} = useAiSuggestIngredients();

    const [edit, setEdit] = useState(initialEdit)

    const resetIngredientEdits = (mealToReset : MealDto) => mealToReset.ingredients?.map(ingredient => ({
        id: ingredient.id,
        index: ingredient.index!,
        input: shortFormat(ingredient)
    })) ?? [];

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
        const newIngredients: IngredientDto[] = ingredientEdits
            .filter(edit => edit.input != '')
            .map(edit => parseIngredient(edit, units, meal))
            .filter(edit => edit != null)
            .map((ingredient, index) => ({...ingredient, index: index})) as IngredientDto[];
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

    const formatSuggestionAsEdit = (s: SuggestedIngredient): string => {
        const parts: string[] = [];
        if (s.amount) parts.push(String(s.amount));
        if (s.unitCode) parts.push(s.unitCode);
        parts.push(s.name);
        return parts.join(' ');
    }

    const handleAcceptSuggestion = (suggestion: SuggestedIngredient, index: number) => {
        setEdit(true);
        const newEdit: IngredientEdit = {
            index: ingredientEdits.length,
            input: formatSuggestionAsEdit(suggestion),
        };
        const filterBlanks = (edits: IngredientEdit[]) => edits.filter(e => e.input !== '');
        setIngredientEdits([...filterBlanks(ingredientEdits), newEdit]);
        removeSuggestion(index);
    }

    const handleAcceptAllSuggestions = () => {
        setEdit(true);
        const filterBlanks = (edits: IngredientEdit[]) => edits.filter(e => e.input !== '');
        const existing = filterBlanks(ingredientEdits);
        const newEdits: IngredientEdit[] = suggestions.map((s, i) => ({
            index: existing.length + i,
            input: formatSuggestionAsEdit(s),
        }));
        setIngredientEdits([...existing, ...newEdits]);
        clearSuggestions();
    }

    const suggestButton = (
        <Button
            startIcon={aiLoading ? <CircularProgress size={16}/> : <AutoAwesome/>}
            onClick={() => suggestIngredients(meal)}
            disabled={!meal.name?.trim() || aiLoading}
        >
            Suggest
        </Button>
    );

    const displayButtons = <>
        {suggestButton}
        {(meal.ingredients?.length ?? 0) > 0 ?
            <Button startIcon={<Edit/>} onClick={handleEditOnClick}>Edit</Button> :
            <Button startIcon={<PlaylistAdd/>} onClick={handleEditOnClick}>Add Ingredients</Button>}
    </>;

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
            {(meal.ingredients?.length ?? 0) > 0 && !edit ? <IngredientList ingredients={meal.ingredients!}/> : null}
            {ingredientEdits.length > 0 && edit ? <IngredientEditList ingredientEdits={ingredientEdits} setIngredientEdits={setIngredientEdits}/> : null}
            {edit ? addButton : null}
            <AnimatePresence>
                {suggestions.length > 0 && (
                    <SuggestedIngredientsList
                        suggestions={suggestions}
                        reasoning={reasoning}
                        onAccept={handleAcceptSuggestion}
                        onAcceptAll={handleAcceptAllSuggestions}
                        onDismiss={removeSuggestion}
                        onDismissAll={clearSuggestions}
                    />
                )}
            </AnimatePresence>
        </Card>
    )
}