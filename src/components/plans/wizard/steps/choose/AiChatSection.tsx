import {Box, Typography, Stack} from "@mui/material";
import Button from "@mui/material-next/Button";
import {CalendarMonth} from "@mui/icons-material";
import {PlanDto, ChatMessage} from "@elliotJHarding/meals-api";
import {useLinkCalendar} from "../../../../../hooks/calendar/useLinkCalendar.ts";
import AiChatInput from "./AiChatInput.tsx";

interface AiChatSectionProps {
    selectedDate: Date | null;
    selectedPlan: PlanDto | null;
    transitioning: boolean;
    mealsLoading: boolean;
    isAuthorized: boolean;
    // AI chat data passed from parent
    conversationHistory: ChatMessage[];
    inputMessage: string;
    isLoading: boolean;
    error: string | null;
    setInputMessage: (message: string) => void;
    sendMessage: (message: string) => void;
}

export default function AiChatSection({
    selectedDate,
    selectedPlan,
    transitioning,
    mealsLoading,
    isAuthorized,
    conversationHistory,
    inputMessage,
    isLoading,
    error,
    setInputMessage,
    sendMessage
}: AiChatSectionProps) {
    // During transitions, keep height stable by showing "Select a day" state
    const isDaySelected = !transitioning && selectedDate !== null && selectedPlan !== null;
    const { authorizeCalendar, authorizing } = useLinkCalendar();

    const handleSendMessage = () => {
        if (!isDaySelected) return;  // Safety check
        sendMessage(inputMessage);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 2, pt: 2, pb: 1 }}>
            <Box sx={{ width: '100%', maxWidth: 800 }}>
                <Stack spacing={1.5}>
                    {!isAuthorized ? (
                        /* Authorization Required State */
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: 'grey.50',
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: 'grey.200'
                            }}
                        >
                            <Stack spacing={1.5} alignItems="center">
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Authorize with Google to enable AI meal suggestions and calendar integration
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<CalendarMonth />}
                                    onClick={authorizeCalendar}
                                    disabled={authorizing}
                                    sx={{ borderRadius: 2 }}
                                >
                                    {authorizing ? 'Authorizing...' : 'Authorize with Google'}
                                </Button>
                            </Stack>
                        </Box>
                    ) : !isDaySelected ? (
                        /* No Day Selected State */
                        <Box
                            sx={{
                                p: 1.5,
                                backgroundColor: 'grey.50',
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: 'grey.200',
                                opacity: 0.5
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" align="center">
                                Select a day to get AI meal suggestions
                            </Typography>
                        </Box>
                    ) : (
                        /* Authorized + Day Selected - Functional Chat */
                        <>
                            {/* Show last AI message if exists */}
                            {conversationHistory.length > 0 && (
                                <Box
                                    sx={{
                                        p: 1.5,
                                        backgroundColor: 'grey.50',
                                        borderRadius: 2,
                                        border: '2px solid',
                                        borderColor: 'grey.200'
                                    }}
                                >
                                    <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {conversationHistory[conversationHistory.length - 1].content}
                                    </Typography>
                                </Box>
                            )}

                            {/* Show error message if exists */}
                            {error && (
                                <Box
                                    sx={{
                                        p: 1.5,
                                        backgroundColor: 'error.light',
                                        borderRadius: 2,
                                        border: '2px solid',
                                        borderColor: 'error.main'
                                    }}
                                >
                                    <Typography variant="body2" color="error.dark">
                                        {error}
                                    </Typography>
                                </Box>
                            )}

                            {/* Input - Suggested meals rendered separately in DayView */}
                            <AiChatInput
                                value={inputMessage}
                                onChange={setInputMessage}
                                onSend={handleSendMessage}
                                isLoading={isLoading}
                                disabled={mealsLoading}
                                error={!!error}
                            />
                        </>
                    )}
                </Stack>
            </Box>
        </Box>
    );
}
