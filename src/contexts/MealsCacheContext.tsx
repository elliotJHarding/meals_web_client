import React, { createContext, useState, useContext } from "react";
import Meal from "../domain/Meal.ts";

export interface MealsCacheContextType {
    getCachedMeals: () => Meal[];
    setCachedMeals: (meals: Meal[]) => void;
    hasCachedMeals: () => boolean;
    invalidateCache: () => void;
}

const MealsCacheContext = createContext<MealsCacheContextType>({
    getCachedMeals: () => [],
    setCachedMeals: () => {},
    hasCachedMeals: () => false,
    invalidateCache: () => {}
});

export function MealsCacheProvider({ children }: { children: React.ReactNode }) {
    const [cachedMeals, setCachedMealsState] = useState<Meal[]>([]);
    const [hasCache, setHasCache] = useState<boolean>(false);

    const getCachedMeals = (): Meal[] => {
        return cachedMeals;
    };

    const setCachedMeals = (meals: Meal[]): void => {
        setCachedMealsState(meals);
        setHasCache(true);
    };

    const hasCachedMeals = (): boolean => {
        return hasCache && cachedMeals.length > 0;
    };

    const invalidateCache = (): void => {
        setCachedMealsState([]);
        setHasCache(false);
    };

    return (
        <MealsCacheContext.Provider value={{
            getCachedMeals,
            setCachedMeals,
            hasCachedMeals,
            invalidateCache
        }}>
            {children}
        </MealsCacheContext.Provider>
    );
}

export const useMealsCache = () => {
    const context = useContext(MealsCacheContext);
    if (!context) {
        throw new Error('useMealsCache must be used within a MealsCacheProvider');
    }
    return context;
};