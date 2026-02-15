import {useState, useRef, useCallback} from "react";
import {MealDto, SuggestedIngredient, SuggestIngredientsRequest, ExistingIngredient} from "@elliotJHarding/meals-api";
import AiRepository from "../../repository/AiRepository.ts";

interface AiSuggestIngredientsState {
    suggestions: SuggestedIngredient[];
    reasoning: string | null;
    isLoading: boolean;
    error: string | null;
}

export function useAiSuggestIngredients() {
    const aiRepository = useRef(new AiRepository()).current;
    const isLoadingRef = useRef(false);
    const [state, setState] = useState<AiSuggestIngredientsState>({
        suggestions: [],
        reasoning: null,
        isLoading: false,
        error: null,
    });

    const suggestIngredients = useCallback((meal: MealDto) => {
        if (!meal.name?.trim() || isLoadingRef.current) return;
        isLoadingRef.current = true;

        setState(prev => ({...prev, isLoading: true, error: null}));

        const existingIngredients: ExistingIngredient[] = (meal.ingredients ?? []).map(ing => ({
            name: ing.name,
            amount: ing.amount,
            unitCode: ing.unit?.code,
        }));

        const request: SuggestIngredientsRequest = {
            mealName: meal.name,
            mealDescription: meal.description,
            tags: (meal.tags ?? []).map(tag => tag.name).filter((name): name is string => !!name),
            serves: meal.serves,
            recipeUrl: meal.recipe?.url,
            existingIngredients: existingIngredients.length > 0 ? existingIngredients : undefined,
        };

        aiRepository.suggestIngredients(
            request,
            (response) => {
                isLoadingRef.current = false;
                setState({
                    suggestions: response.ingredients,
                    reasoning: response.reasoning ?? null,
                    isLoading: false,
                    error: null,
                });
            },
            () => {
                isLoadingRef.current = false;
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Failed to get ingredient suggestions. Please try again.',
                }));
            }
        );
    }, [aiRepository]);

    const clearSuggestions = useCallback(() => {
        setState({suggestions: [], reasoning: null, isLoading: false, error: null});
    }, []);

    const removeSuggestion = useCallback((index: number) => {
        setState(prev => ({
            ...prev,
            suggestions: prev.suggestions.filter((_, i) => i !== index),
        }));
    }, []);

    return {
        suggestions: state.suggestions,
        reasoning: state.reasoning,
        isLoading: state.isLoading,
        error: state.error,
        suggestIngredients,
        clearSuggestions,
        removeSuggestion,
    };
}
