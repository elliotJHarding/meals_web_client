import {Typography, Box, useTheme, useMediaQuery, Container} from "@mui/material";
import { motion } from "framer-motion";
import {ShoppingCart, Restaurant, CalendarMonth} from "@mui/icons-material";
import Button from "@mui/material-next/Button";
import {Link as RouterLink} from "react-router-dom";

export default function LandingPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // @ts-expect-error - MUI theme system type not fully defined
    const primaryColor = theme.sys.color.primary;

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* Hero Section */}
            <Box sx={{ textAlign: 'center', mb: 12 }}>
                <motion.div {...fadeInUp}>
                    <Typography 
                        variant="h1" 
                        component="h1" 
                        sx={{ 
                            fontSize: isMobile ? '2.5rem' : '4rem',
                            fontWeight: 300,
                            mb: 3,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        Effortless Meal Planning
                    </Typography>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
                    <Typography 
                        variant="h5" 
                        component="p" 
                        sx={{ 
                            mb: 6,
                            color: 'text.secondary',
                            fontWeight: 300,
                            maxWidth: 600,
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        Plan your meals, organize your kitchen, and simplify your shopping — all in one place.
                    </Typography>
                </motion.div>

                <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.4 }}>
                    <Button 
                        variant="filled"
                        size="large"
                        component={RouterLink}
                        to="/login"
                        sx={{
                            py: 2,
                            px: 6,
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            borderRadius: 3,
                        }}
                    >
                        Get Started
                    </Button>
                </motion.div>
            </Box>

            {/* Features Section */}
            <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 6, mb: 12 }}>
                <motion.div 
                    {...fadeInUp} 
                    transition={{ ...fadeInUp.transition, delay: 0.6 }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ mb: 3 }}>
                            <Restaurant sx={{ fontSize: 48, color: primaryColor }} />
                        </Box>
                        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 500 }}>
                            Organize Your Meals
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            Create and manage your favorite recipes with ingredients and cooking instructions.
                        </Typography>
                    </Box>
                </motion.div>

                <motion.div 
                    {...fadeInUp} 
                    transition={{ ...fadeInUp.transition, delay: 0.8 }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ mb: 3, position: 'relative', display: 'inline-block' }}>
                            {/* Outer fire glow */}
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 8,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                                style={{
                                    position: 'absolute',
                                    top: -12,
                                    left: -12,
                                    right: -12,
                                    bottom: -12,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(255,193,7,0.3) 0%, rgba(255,152,0,0.2) 40%, rgba(255,87,34,0.1) 70%, transparent 100%)',
                                    filter: 'blur(8px)',
                                }}
                            />
                            
                            {/* Inner fire ring */}
                            <motion.div
                                animate={{
                                    rotate: [360, 0],
                                    opacity: [0.6, 0.9, 0.6],
                                }}
                                transition={{
                                    duration: 6,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                                style={{
                                    position: 'absolute',
                                    top: -8,
                                    left: -8,
                                    right: -8,
                                    bottom: -8,
                                    borderRadius: '50%',
                                    background: 'conic-gradient(from 0deg, rgba(255,193,7,0.4), rgba(255,152,0,0.6), rgba(255,87,34,0.4), rgba(255,193,7,0.4))',
                                    filter: 'blur(4px)',
                                }}
                            />
                            
                            {/* Central pulsing glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.4, 0.7, 0.4],
                                }}
                                transition={{
                                    duration: 3,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                                style={{
                                    position: 'absolute',
                                    top: -4,
                                    left: -4,
                                    right: -4,
                                    bottom: -4,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255,193,7,0.2)',
                                    filter: 'blur(2px)',
                                }}
                            />
                            
                            <CalendarMonth sx={{ fontSize: 48, color: primaryColor, position: 'relative', zIndex: 1 }} />
                        </Box>
                        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 500 }}>
                            Plan Your Week
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            Schedule meals for each day and let our AI suggest the perfect combination.
                        </Typography>
                    </Box>
                </motion.div>

                <motion.div 
                    {...fadeInUp} 
                    transition={{ ...fadeInUp.transition, delay: 1.0 }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ mb: 3 }}>
                            <ShoppingCart sx={{ fontSize: 48, color: primaryColor }} />
                        </Box>
                        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 500 }}>
                            Smart Shopping Lists
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            Automatically generate organized shopping lists from your meal plans.
                        </Typography>
                    </Box>
                </motion.div>
            </Box>

        </Container>
    )
}
