import { Box, Typography, Container, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import GoogleAuth from "../common/GoogleAuth.tsx";

export default function LoginPage() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 4
                }}
            >
                <motion.div {...fadeInUp}>
                    <Box
                        sx={{
                            p: 6,
                            borderRadius: 3,
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        {/* Welcome Message */}
                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{
                                mb: 2,
                                fontWeight: 300,
                                color: 'text.primary'
                            }}
                        >
                            Welcome
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                color: 'text.secondary',
                                maxWidth: 400,
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            Sign in with your Google account to access your meal plans, recipes, and shopping lists.
                        </Typography>

                        <GoogleAuth variant={"medium"} />

                    </Box>
                </motion.div>
                {/* Privacy Note */}
                <Typography
                    variant="caption"
                    sx={{
                        mt: 4,
                        display: 'block',
                        color: 'text.secondary',
                        maxWidth: 350,
                        mx: 'auto'
                    }}
                >
                    By signing in, you agree to our terms of service and privacy policy. We only access your basic profile information.
                </Typography>
            </Box>
        </Container>
    );
}