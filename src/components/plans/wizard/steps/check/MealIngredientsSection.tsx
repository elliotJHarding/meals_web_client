import {useState} from "react";
import {Avatar, Chip, CircularProgress, Collapse, Stack, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material-next/Button";
import IconButton from "@mui/material/IconButton";
import {Add, AutoAwesome, Close, Edit, ExpandLess, ExpandMore, PlaylistAdd, RestaurantMenu} from "@mui/icons-material";
import {MealDto, ShoppingListItemDto, SuggestedIngredient} from "@elliotJHarding/meals-api";
import {AnimatePresence, motion} from "framer-motion";
import IngredientCheck from "./IngredientCheck.tsx";
import IngredientEditList from "../../../../meals/ingredients/IngredientEditList.tsx";
import SuggestedIngredientsList from "../../../../meals/ingredients/SuggestedIngredientsList.tsx";
import ConfirmCancelButtons from "../../../../common/ConfirmCancelButtons.tsx";
import {IngredientEdit} from "../../../../../types/IngredientEdit.ts";
import {parseIngredient, shortFormat} from "../../../../../utils/IngredientUtils.ts";
import {sortShoppingListItems} from "../../../../../utils/ShoppingListUtils.ts";
import {useAiSuggestIngredients} from "../../../../../hooks/ai/useAiSuggestIngredients.ts";
import {useMealUpdate} from "../../../../../hooks/meal/useMealUpdate.ts";
import {useUnits} from "../../../../../hooks/unit/useUnits.ts";

interface MealIngredientsSectionProps {
    meal: MealDto;
    dayLabels: string[];
    shoppingListItems: ShoppingListItemDto[];
    onCheckToggle: (ingredientId: number) => void;
    onMealUpdated: () => void;
    defaultExpanded?: boolean;
}

export default function MealIngredientsSection({
    meal,
    dayLabels,
    shoppingListItems,
    onCheckToggle,
    onMealUpdated,
    defaultExpanded = true,
}: MealIngredientsSectionProps) {

    const [expanded, setExpanded] = useState(defaultExpanded);
    const [edit, setEdit] = useState(false);

    const {units} = useUnits();
    const {suggestions, reasoning, isLoading: aiLoading, suggestIngredients, clearSuggestions, removeSuggestion} = useAiSuggestIngredients();
    const {updateMeal} = useMealUpdate(() => {
        setEdit(false);
        onMealUpdated();
    });

    const sortedItems = [...shoppingListItems].sort(sortShoppingListItems);
    const checkedCount = sortedItems.filter(item => item.checked).length;
    const totalCount = sortedItems.length;

    const resetIngredientEdits = (m: MealDto): IngredientEdit[] =>
        m.ingredients?.map(ingredient => ({
            id: ingredient.id,
            index: ingredient.index!,
            input: shortFormat(ingredient),
        })) ?? [];

    const [ingredientEdits, setIngredientEdits] = useState<IngredientEdit[]>(resetIngredientEdits(meal));

    const handleEditClick = () => {
        setExpanded(true);
        setEdit(true);
        setIngredientEdits(resetIngredientEdits(meal));
        if ((meal.ingredients?.length ?? 0) === 0) addBlank();
    };

    const handleCancel = () => {
        setIngredientEdits(resetIngredientEdits(meal));
        setEdit(false);
        clearSuggestions();
    };

    const handleConfirm = () => {
        const newIngredients = ingredientEdits
            .filter(e => e.input !== '')
            .map(e => parseIngredient(e, units, meal))
            .filter((ing): ing is NonNullable<typeof ing> => ing != null)
            .map((ingredient, index) => ({...ingredient, index}));
        const newMeal = {...meal, ingredients: newIngredients};
        updateMeal(newMeal);
    };

    const addBlank = () => {
        setIngredientEdits(prev => [...prev, {index: prev.length, input: ''}]);
    };

    const formatSuggestionAsEdit = (s: SuggestedIngredient): string => {
        const parts: string[] = [];
        if (s.amount) parts.push(String(s.amount));
        if (s.unitCode) parts.push(s.unitCode);
        parts.push(s.name);
        return parts.join(' ');
    };

    const handleAcceptSuggestion = (suggestion: SuggestedIngredient, index: number) => {
        setEdit(true);
        setExpanded(true);
        const newEdit: IngredientEdit = {
            index: ingredientEdits.length,
            input: formatSuggestionAsEdit(suggestion),
        };
        const filterBlanks = (edits: IngredientEdit[]) => edits.filter(e => e.input !== '');
        setIngredientEdits([...filterBlanks(ingredientEdits), newEdit]);
        removeSuggestion(index);
    };

    const handleAcceptAllSuggestions = () => {
        setEdit(true);
        setExpanded(true);
        const filterBlanks = (edits: IngredientEdit[]) => edits.filter(e => e.input !== '');
        const existing = filterBlanks(ingredientEdits);
        const newEdits: IngredientEdit[] = suggestions.map((s, i) => ({
            index: existing.length + i,
            input: formatSuggestionAsEdit(s),
        }));
        setIngredientEdits([...existing, ...newEdits]);
        clearSuggestions();
    };

    const hasIngredients = totalCount > 0 || (meal.ingredients?.length ?? 0) > 0;

    return (
        <Box component={motion.div} layout>
            {/* Header */}
            <Stack
                direction='row'
                alignItems='center'
                sx={{cursor: 'pointer', py: 1}}
                onClick={() => setExpanded(prev => !prev)}
                component={motion.div}
                layout
            >
                {expanded ? <ExpandLess/> : <ExpandMore/>}
                <Avatar
                    src={meal.image?.url}
                    sx={{width: 28, height: 28, ml: 0.5}}
                >
                    {!meal.image?.url && <RestaurantMenu sx={{fontSize: 16}}/>}
                </Avatar>
                <Typography variant='subtitle1' sx={{fontWeight: 500, ml: 1}}>
                    {meal.name}
                </Typography>
                <Stack direction='row' gap={0.5} sx={{ml: 1}}>
                    {dayLabels.map(day => (
                        <Chip key={day} label={day} size='small' variant='outlined'/>
                    ))}
                </Stack>
                <Box sx={{flexGrow: 1}}/>
                {hasIngredients && (
                    <Typography variant='body2' color='text.secondary' sx={{mr: 1}}>
                        {checkedCount}/{totalCount}
                    </Typography>
                )}
            </Stack>

            {/* Body */}
            <Collapse in={expanded}>
                <Box sx={{pl: 1, pb: 2}} component={motion.div} layout>
                    {!edit && hasIngredients && (
                        <>
                            <Stack gap={1}>
                                {sortedItems.map(item => (
                                    <IngredientCheck
                                        key={item.ingredient?.id}
                                        ingredient={item.ingredient}
                                        checked={item.checked}
                                        onToggle={() => item.ingredient?.id != null && onCheckToggle(item.ingredient.id)}
                                    />
                                ))}
                            </Stack>
                            <Stack direction='row' gap={1} sx={{mt: 1.5}}>
                                <Button size='small' startIcon={<Edit/>} onClick={handleEditClick}>
                                    Edit
                                </Button>
                                <Button
                                    size='small'
                                    startIcon={aiLoading ? <CircularProgress size={16}/> : <AutoAwesome/>}
                                    onClick={() => suggestIngredients(meal)}
                                    disabled={!meal.name?.trim() || aiLoading}
                                >
                                    Suggest
                                </Button>
                            </Stack>
                        </>
                    )}

                    {!edit && !hasIngredients && (
                        <Stack alignItems='center' sx={{py: 2}} gap={1}>
                            <Typography variant='body2' color='text.secondary'>
                                No ingredients yet
                            </Typography>
                            <Stack direction='row' gap={1}>
                                <Button size='small' startIcon={<PlaylistAdd/>} onClick={handleEditClick}>
                                    Add Ingredients
                                </Button>
                                <Button
                                    size='small'
                                    startIcon={aiLoading ? <CircularProgress size={16}/> : <AutoAwesome/>}
                                    onClick={() => suggestIngredients(meal)}
                                    disabled={!meal.name?.trim() || aiLoading}
                                >
                                    Suggest
                                </Button>
                            </Stack>
                        </Stack>
                    )}

                    {edit && (
                        <>
                            <IngredientEditList ingredientEdits={ingredientEdits} setIngredientEdits={setIngredientEdits}/>
                            <Stack direction='row' sx={{width: {xs: '100%', md: '50%'}}}>
                                <Button sx={{width: '100%', borderRadius: 1}} onClick={addBlank} startIcon={<Add/>}
                                        fullWidth variant='filledTonal' component={motion.div} layout
                                        initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}}>
                                    Add
                                </Button>
                                <IconButton sx={{visibility: 'hidden'}}>
                                    <Close/>
                                </IconButton>
                            </Stack>
                            <ConfirmCancelButtons handleConfirm={handleConfirm} handleCancel={handleCancel}/>
                        </>
                    )}

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
                </Box>
            </Collapse>
        </Box>
    );
}
