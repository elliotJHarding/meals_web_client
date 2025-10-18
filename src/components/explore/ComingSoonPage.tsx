import {Typography, Box, useTheme, useMediaQuery, Container, Stack} from "@mui/material";
import { motion } from "framer-motion";
import {Explore, Construction} from "@mui/icons-material";

export default function ComingSoonPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ textAlign: 'center', my: 8 }}>
                <motion.div {...fadeInUp}>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
                        <Explore
                            sx={{
                                fontSize: isMobile ? '3rem' : '5rem',
                                color: 'contrastText',
                                opacity: 0.8
                            }}
                        />
                        <Construction
                            sx={{
                                fontSize: isMobile ? '2rem' : '3rem',
                                color: 'contrastText',
                                opacity: 0.6
                            }}
                        />
                    </Stack>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontSize: isMobile ? '2rem' : '3.5rem',
                            fontWeight: 300,
                            mb: 3,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Explore
                    </Typography>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.4 }}>
                    <Typography
                        variant="h5"
                        component="p"
                        sx={{
                            mb: 4,
                            fontWeight: 400,
                            color: 'text.secondary',
                            fontSize: isMobile ? '1.2rem' : '1.5rem'
                        }}
                    >
                        Coming Soon
                    </Typography>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.6 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '600px',
                            mx: 'auto',
                            fontSize: isMobile ? '0.95rem' : '1.1rem',
                            lineHeight: 1.7
                        }}
                    >
                        We're working on something exciting! The explore feature will help you discover new meals,
                        recipes, and culinary inspiration. Stay tuned!
                    </Typography>
                </motion.div>
            </Box>
        </Container>
    );
}
