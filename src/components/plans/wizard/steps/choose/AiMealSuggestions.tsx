import { Box, Stack, Typography, TextField, InputAdornment, CircularProgress, Paper } from "@mui/material";
import { Send, SmartToy } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Button from "@mui/material-next/Button";
import IconButton from "@mui/material-next/IconButton";
import Plan from "../../../../../domain/Plan.ts";
import Meal from "../../../../../domain/Meal.ts";
import CalendarEvent from "../../../../../domain/CalendarEvent.ts";
import MealPlan from "../../../../../domain/MealPlan.ts";
import ChatMessage from "../../../../../domain/ai/ChatMessage.ts";
import SuggestedMeal from "../../../../../domain/ai/SuggestedMeal.ts";
import MealPlanChatRequest from "../../../../../domain/ai/MealPlanChatRequest.ts";
import AiRepository from "../../../../../repository/AiRepository.ts";
import SuggestedMealCard from "./SuggestedMealCard.tsx";

interface AiMealSuggestionsProps {
    plan: Plan;
    mealPlan: MealPlan;
    meals: Meal[];
    calendarEvents: CalendarEvent[];
    onAddMeal: (meal: Meal, servings: number, leftovers: boolean) => void;
}

export default function AiMealSuggestions({
    plan,
    mealPlan,
    meals,
    calendarEvents,
    onAddMeal
}: AiMealSuggestionsProps) {
    const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
    const [chatContext, setChatContext] = useState<Record<string, any>>({});
    const [currentSuggestions, setCurrentSuggestions] = useState<SuggestedMeal[]>([]);
    const [currentReasoning, setCurrentReasoning] = useState<string>("");
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const aiRepository = useRef(new AiRepository()).current;

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationHistory, currentSuggestions]);

    // Filter calendar events to only show events on the plan date
    const filteredCalendarEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.time);
        const planDate = new Date(plan.date);
        return eventDate.toDateString() === planDate.toDateString();
    });

    const sendMessage = (message: string) => {
        if (!message.trim() || isLoading) return;

        // Add user message to history
        const userMessage: ChatMessage = { role: 'user', content: message };
        const updatedHistory = [...conversationHistory, userMessage];
        setConversationHistory(updatedHistory);
        setInputMessage("");
        setIsLoading(true);

        // Prepare request - serialize dates to avoid backend parsing issues
        const request: MealPlanChatRequest = {
            dayOfWeek: plan.date.toISOString().split('T')[0],
            calendarEvents: filteredCalendarEvents.map(event => ({
                ...event,
                time: event.time.toISOString()
            })) as any,
            currentWeekPlan: mealPlan.plans.map(p => ({
                ...p,
                date: p.date.toISOString()
            })) as any,
            recentMealPlans: [], // Could be enhanced to fetch recent plans
            availableMeals: meals,
            conversationHistory: updatedHistory,
            chatContext: chatContext
        };

        // Call AI API
        aiRepository.chatMealPlanSuggestions(
            request,
            (response) => {
                // Add assistant response to history
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: response.reasoning
                };
                setConversationHistory([...updatedHistory, assistantMessage]);

                // Update suggestions and context
                setCurrentSuggestions(response.suggestions);
                setCurrentReasoning(response.reasoning);
                setChatContext(response.updatedChatContext);
                setIsLoading(false);
            },
            () => {
                setIsLoading(false);
                // Error is handled by repository toast
            }
        );
    };

    const handleStartConversation = () => {
        setHasStarted(true);
        sendMessage("What meals would you suggest for this day?");
    };

    const handleAddSuggestedMeal = (suggestedMeal: SuggestedMeal) => {
        onAddMeal(suggestedMeal.meal, suggestedMeal.meal.serves, false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputMessage);
        }
    };

    return (
        <Stack spacing={2} sx={{ height: '100%', maxHeight: 600 }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1}>
                <SmartToy sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="600">
                    AI Assistant
                </Typography>
            </Stack>

            {!hasStarted ? (
                /* Initial State */
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        py: 4,
                        px: 2,
                        backgroundColor: 'grey.50',
                        borderRadius: 2,
                        border: '2px dashed',
                        borderColor: 'grey.300'
                    }}
                >
                    <SmartToy sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Get AI-powered meal suggestions based on your calendar and preferences
                    </Typography>
                    <Button
                        variant="filled"
                        onClick={handleStartConversation}
                        disabled={isLoading}
                    >
                        Get Suggestions
                    </Button>
                </Box>
            ) : (
                <>
                    {/* Chat Messages and Suggestions */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            pr: 1
                        }}
                    >
                        <AnimatePresence>
                            {conversationHistory.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: message.role === 'user' ? 'primary.light' : 'grey.100',
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Typography variant="caption" fontWeight="600" color="text.secondary">
                                            {message.role === 'user' ? 'You' : 'AI Assistant'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                                            {message.content}
                                        </Typography>
                                    </Paper>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Meal Suggestions */}
                        {currentSuggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Stack spacing={1}>
                                    <Typography variant="caption" fontWeight="600" color="text.secondary">
                                        Suggested Meals
                                    </Typography>
                                    {currentSuggestions.map((suggestion, index) => (
                                        <SuggestedMealCard
                                            key={index}
                                            suggestedMeal={suggestion}
                                            onAddMeal={handleAddSuggestedMeal}
                                        />
                                    ))}
                                </Stack>
                            </motion.div>
                        )}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                                    <CircularProgress size={16} />
                                    <Typography variant="caption" color="text.secondary">
                                        AI is thinking...
                                    </Typography>
                                </Box>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Field */}
                    <TextField
                        size="small"
                        fullWidth
                        multiline
                        maxRows={3}
                        placeholder="Ask for different suggestions..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => sendMessage(inputMessage)}
                                        disabled={!inputMessage.trim() || isLoading}
                                        sx={{
                                            color: 'primary.main',
                                            '&:disabled': {
                                                color: 'grey.400'
                                            }
                                        }}
                                    >
                                        <Send fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'divider',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />
                </>
            )}
        </Stack>
    );
}
