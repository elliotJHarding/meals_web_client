import {Box, Collapse, Container, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import {motion} from "framer-motion";
import {ArrowBackIos, ErrorOutline, ExpandMore, Home} from "@mui/icons-material";
import {isRouteErrorResponse, useNavigate, useRouteError} from "react-router-dom";
import {useState} from "react";
import Button from "@mui/material-next/Button";

export default function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [showDetails, setShowDetails] = useState(false);

    let errorMessage: string;
    let errorStatus: string | number | undefined;

    if (isRouteErrorResponse(error)) {
        // Error thrown from a loader or action
        errorStatus = error.status;
        errorMessage = error.statusText || error.data?.message || "An error occurred";
    } else if (error instanceof Error) {
        // JavaScript Error
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = "An unexpected error occurred";
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', my: 8 }}>
                <motion.div {...fadeInUp}>
                    <ErrorOutline
                        sx={{
                            fontSize: isMobile ? '4rem' : '6rem',
                            color: 'primary',
                            opacity: 0.7,
                            mb: 3
                        }}
                    />
                </motion.div>

                {errorStatus && (
                    <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontSize: isMobile ? '2.5rem' : '4rem',
                                fontWeight: 300,
                                mb: 2,
                                color: 'text.primary'
                            }}
                        >
                            {errorStatus}
                        </Typography>
                    </motion.div>
                )}

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontSize: isMobile ? '1.75rem' : '2.5rem',
                            fontWeight: 300,
                            mb: 3,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Oops! Something went wrong
                    </Typography>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.4 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '600px',
                            mx: 'auto',
                            mb: 4,
                            fontSize: isMobile ? '0.95rem' : '1.1rem',
                            lineHeight: 1.7
                        }}
                    >
                        We apologize for the inconvenience. Something unexpected happened.
                    </Typography>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.6 }}>
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                        <Button
                            variant="filled"
                            startIcon={<Home />}
                            onClick={() => navigate('/')}
                        >
                            Home
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIos/>}
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>
                    </Stack>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.7 }}>
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => setShowDetails(!showDetails)}
                        endIcon={
                            <ExpandMore
                                sx={{
                                    transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s'
                                }}
                            />
                        }
                        sx={{ color: 'text.secondary' }}
                    >
                        {showDetails ? 'Hide' : 'Show'} Error Details
                    </Button>
                </motion.div>

                <Collapse in={showDetails}>
                    <Box
                        sx={{
                            mt: 3,
                            p: 3,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            textAlign: 'left',
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        <Typography
                            variant="caption"
                            component="pre"
                            sx={{
                                color: 'text.secondary',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem'
                            }}
                        >
                            {errorMessage}
                        </Typography>
                    </Box>
                </Collapse>
            </Box>
        </Container>
    );
}
