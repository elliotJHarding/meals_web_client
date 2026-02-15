import {Stack, Typography, Box} from "@mui/material";
import Button from "@mui/material-next/Button";
import {Add, AutoAwesome, Close} from "@mui/icons-material";
import IconButton from "@mui/material-next/IconButton";
import {SuggestedIngredient} from "@elliotJHarding/meals-api";
import {AnimatePresence, motion} from "framer-motion";

function formatSuggestion(suggestion: SuggestedIngredient): string {
    const parts: string[] = [];
    if (suggestion.amount) {
        parts.push(String(suggestion.amount));
    }
    if (suggestion.unitCode) {
        parts.push(suggestion.unitCode);
    }
    parts.push(suggestion.name);
    return parts.join(' ');
}

export default function SuggestedIngredientsList({
    suggestions,
    reasoning,
    onAccept,
    onAcceptAll,
    onDismiss,
    onDismissAll,
}: {
    suggestions: SuggestedIngredient[];
    reasoning?: string | null;
    onAccept: (suggestion: SuggestedIngredient, index: number) => void;
    onAcceptAll: () => void;
    onDismiss: (index: number) => void;
    onDismissAll: () => void;
}) {
    if (suggestions.length === 0) return null;

    return (
        <Box
            component={motion.div}
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            sx={{mt: 2}}
        >
            <Stack direction='row' alignItems='center' sx={{mb: 0.5}}>
                <AutoAwesome sx={{color: 'text.secondary', mr: 0.5, fontSize: 16}}/>
                <Typography variant='caption' color='text.secondary' sx={{flex: 1}}>
                    Suggestions
                </Typography>
                <Button size="small" onClick={onAcceptAll}>
                    Add All
                </Button>
                <Button size="small" variant="text" onClick={onDismissAll}>
                    Dismiss
                </Button>
            </Stack>
            {reasoning && (
                <Typography variant='caption' color='text.secondary' sx={{mb: 1, display: 'block', fontStyle: 'italic'}}>
                    {reasoning}
                </Typography>
            )}
            <Stack gap={0}>
                <AnimatePresence mode="popLayout">
                    {suggestions.map((suggestion, index) => (
                        <motion.div
                            key={`${suggestion.name}-${index}`}
                            layout
                            initial={{opacity: 0, x: -10}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 10, transition: {duration: 0.15}}}
                            transition={{duration: 0.2, delay: index * 0.02}}
                        >
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 0.25,
                                pl: 1,
                                borderRadius: 1,
                                '&:hover': {backgroundColor: 'rgba(80, 101, 44, 0.06)'},
                                '&:hover .dismiss-btn': {opacity: 1},
                            }}>
                                <Typography variant='body2' color='text.secondary' sx={{flex: 1}}>
                                    {formatSuggestion(suggestion)}
                                </Typography>
                                <IconButton size="small" onClick={() => onAccept(suggestion, index)}>
                                    <Add sx={{fontSize: 18}}/>
                                </IconButton>
                                <IconButton size="small" onClick={() => onDismiss(index)} className="dismiss-btn" sx={{opacity: 0.4}}>
                                    <Close sx={{fontSize: 16}}/>
                                </IconButton>
                            </Box>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </Stack>
        </Box>
    );
}
