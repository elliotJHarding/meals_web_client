import {TextField, InputAdornment, CircularProgress, Box, useTheme} from "@mui/material";
import {ArrowForward, Send, SmartToy} from "@mui/icons-material";
import IconButton from "@mui/material-next/IconButton";

interface AiChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    isLoading: boolean;
    disabled?: boolean;
}

export default function AiChatInput({ value, onChange, onSend, isLoading, disabled }: AiChatInputProps) {

    const theme = useTheme();

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <TextField
                size="small"
                fullWidth
                multiline
                maxRows={2}
                placeholder="Ask AI for meal suggestions..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading || disabled}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            {isLoading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <IconButton
                                    size="small"
                                    onClick={onSend}
                                    disabled={!value.trim() || isLoading}
                                    sx={{
                                        color: theme.sys.color.tertiary,
                                        '&:disabled': {
                                            color: 'grey.400'
                                        },
                                        borderRadius: 1
                                    }}
                                >
                                    <ArrowForward  />
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                    sx: { borderRadius: 2 }
                }}
                sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: theme.sys.color.tertiary,
                        },
                    },
                }}
            />
        </Box>
    );
}
