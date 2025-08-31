import React, { createContext, useState, useContext } from "react";
import CalendarEvent from "../domain/CalendarEvent.ts";

interface CachedCalendarEvents {
    events: CalendarEvent[];
    cachedAt: number;
    from: string;
    to: string;
    isAuthorized: boolean;
}

export interface CalendarEventsCacheContextType {
    getCachedEvents: (from: string, to: string) => CalendarEvent[] | null;
    setCachedEvents: (from: string, to: string, events: CalendarEvent[], isAuthorized: boolean) => void;
    hasCachedEvents: (from: string, to: string, ttlMs?: number) => boolean;
    getCachedAuthStatus: (from: string, to: string) => boolean | null;
    invalidateCache: () => void;
}

const CalendarEventsCacheContext = createContext<CalendarEventsCacheContextType>({
    getCachedEvents: () => null,
    setCachedEvents: () => {},
    hasCachedEvents: () => false,
    getCachedAuthStatus: () => null,
    invalidateCache: () => {}
});

export function CalendarEventsCacheProvider({ 
    children,
    defaultTtlMs = 5 * 60 * 1000 // 5 minutes default TTL
}: { 
    children: React.ReactNode;
    defaultTtlMs?: number;
}) {
    const [cache, setCache] = useState<Map<string, CachedCalendarEvents>>(new Map());

    const getCacheKey = (from: string, to: string): string => {
        return `${from}_${to}`;
    };

    const getCachedEvents = (from: string, to: string): CalendarEvent[] | null => {
        const key = getCacheKey(from, to);
        const cached = cache.get(key);
        return cached ? cached.events : null;
    };

    const setCachedEvents = (from: string, to: string, events: CalendarEvent[], isAuthorized: boolean): void => {
        const key = getCacheKey(from, to);
        const newCache = new Map(cache);
        newCache.set(key, {
            events,
            cachedAt: Date.now(),
            from,
            to,
            isAuthorized
        });
        setCache(newCache);
    };

    const hasCachedEvents = (from: string, to: string, ttlMs: number = defaultTtlMs): boolean => {
        const key = getCacheKey(from, to);
        const cached = cache.get(key);
        
        if (!cached) return false;
        
        const now = Date.now();
        const isExpired = (now - cached.cachedAt) > ttlMs;
        
        return !isExpired;
    };

    const getCachedAuthStatus = (from: string, to: string): boolean | null => {
        const key = getCacheKey(from, to);
        const cached = cache.get(key);
        return cached ? cached.isAuthorized : null;
    };

    const invalidateCache = (): void => {
        setCache(new Map());
    };

    return (
        <CalendarEventsCacheContext.Provider value={{
            getCachedEvents,
            setCachedEvents,
            hasCachedEvents,
            getCachedAuthStatus,
            invalidateCache
        }}>
            {children}
        </CalendarEventsCacheContext.Provider>
    );
}

export const useCalendarEventsCache = () => {
    const context = useContext(CalendarEventsCacheContext);
    if (!context) {
        throw new Error('useCalendarEventsCache must be used within a CalendarEventsCacheProvider');
    }
    return context;
};