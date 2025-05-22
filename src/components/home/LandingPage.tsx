import Grid from "@mui/material/Unstable_Grid2";
import {Typography, Box, Button, useTheme, useMediaQuery, Container, Paper} from "@mui/material";
import { motion } from "framer-motion";
import {ShoppingCart, Restaurant} from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";


export default function LandingPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // @ts-ignore
    const primaryColor = theme.sys.color.primary;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
                type: "spring", 
                stiffness: 100 
            }
        }
    };

    return (
        <Container maxWidth="xl">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Hero Section */}
                <Grid container spacing={5} sx={{ mt: isMobile ? 2 : 5, mb: 10 }}>
                    <Grid xs={12} md={6} display="flex" flexDirection="column" justifyContent="center">
                        <motion.div variants={itemVariants}>
                            <Typography 
                                variant="h2" 
                                component="h1" 
                                fontWeight="bold" 
                                gutterBottom
                                sx={{ 
                                    fontSize: isMobile ? '2.5rem' : '3.5rem'
                                }}
                            >
                                Make Meal Planning Effortless
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography 
                                variant="h5" 
                                component="p" 
                                sx={{ 
                                    mb: 4,
                                    color: 'text.secondary',
                                    fontSize: isMobile ? '1.2rem' : '1.5rem'
                                }}
                            >
                                Take the stress out of your weekly shop
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Button 
                                variant="contained"
                                size="large"
                                sx={{
                                    backgroundColor: primaryColor,
                                    fontSize: '1.1rem',
                                    fontFamily: 'Roboto',
                                }}
                            >
                                Get Started
                            </Button>
                        </motion.div>
                    </Grid>

                </Grid>

                {/* How It Works Section */}
                <Paper sx={{ mb: 10, borderRadius: 4, p: isMobile ? 4 : 8, textAlign: 'center' }}>
                    <Typography 
                        variant="h3" 
                        component="h2" 
                        textAlign="center" 
                        fontWeight="bold"
                        sx={{ 
                            mb: 6,
                            fontSize: isMobile ? '2rem' : '2.5rem'
                        }}
                    >
                        How It Works
                    </Typography>

                    <Grid container spacing={isMobile ? 4 : 8}>
                        <Grid xs={12} md={4}>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        p: 2
                                    }}
                                >
                                    <Box 
                                        sx={{ 
                                            backgroundColor: `${primaryColor}20`,
                                            p: 3,
                                            borderRadius: '50%',
                                            mb: 3
                                        }}
                                    >
                                        <Restaurant sx={{ fontSize: 60, color: primaryColor }} />
                                    </Box>
                                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                                        1. Add Your Meals
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Create your collection of favorite recipes or add quick meal ideas.
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Grid>

                        <Grid xs={12} md={4}>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        p: 2
                                    }}
                                >
                                    <Box 
                                        sx={{ 
                                            position: 'relative',
                                            mb: 3
                                        }}
                                    >
                                        {/* Orange circle with fire-like glow for AI indication */}
                                        <motion.div
                                            animate={{
                                                rotate: [0, 120, 240, 360, 0],
                                                scale: [1, 1.15, 1, 1.05, 1],
                                                boxShadow: [
                                                    '0 0 10px 5px rgba(255, 165, 0, 0.8), 0 0 20px 10px rgba(255, 69, 0, 0.3)',
                                                ]
                                            }}
                                            transition={{
                                                duration: 4,
                                                ease: "easeInOut",
                                                repeat: Infinity,
                                                repeatType: 'mirror',
                                                type: "tween"
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                borderRadius: '50%',
                                                backgroundColor: '#FFCC80',
                                                zIndex: 0
                                            }}
                                        />
                                        {/* Additional fire-like swirling layer */}
                                        {/*<motion.div*/}
                                        {/*    animate={{*/}
                                        {/*        rotate: [360, 240, 120, 0, 360],*/}
                                        {/*        scale: [1, 1.18, 0.96, 1],*/}
                                        {/*        opacity: [0.5, 0.7, 0.6, 0.5],*/}
                                        {/*    }}*/}
                                        {/*    transition={{*/}
                                        {/*        duration: 4.5,*/}
                                        {/*        ease: "easeInOut",*/}
                                        {/*        repeat: Infinity,*/}
                                        {/*        repeatType: 'loop',*/}
                                        {/*        type: "tween"*/}
                                        {/*    }}*/}
                                        {/*    style={{*/}
                                        {/*        position: 'absolute',*/}
                                        {/*        top: -5,*/}
                                        {/*        left: -5,*/}
                                        {/*        right: -5,*/}
                                        {/*        bottom: -5,*/}
                                        {/*        borderRadius: '50%',*/}
                                        {/*        background: 'radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,69,0,0.4) 60%, rgba(255,140,0,0.2) 80%, transparent 100%)',*/}
                                        {/*        zIndex: 0*/}
                                        {/*    }}*/}
                                        {/*/>*/}
                                        <Box 
                                            sx={{ 
                                                backgroundColor: 'white',
                                                p: 3,
                                                borderRadius: '50%',
                                                position: 'relative',
                                                zIndex: 1
                                            }}
                                        >
                                            <CalendarMonthIcon sx={{ fontSize: 60, color: primaryColor }} />
                                        </Box>
                                    </Box>
                                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                                        2. Create Your Plan
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Add meals to you meal plan, or let AI do it for you.
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Grid>

                        <Grid xs={12} md={4}>
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                            >
                                <Box 
                                    sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        p: 2
                                    }}
                                >
                                    <Box 
                                        sx={{ 
                                            backgroundColor: `${primaryColor}20`,
                                            p: 3,
                                            borderRadius: '50%',
                                            mb: 3
                                        }}
                                    >
                                        <ShoppingCart sx={{ fontSize: 60, color: primaryColor }} />
                                    </Box>
                                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                                        3. Get Shopping List
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Automatically generate your shopping list based on your meal plan.
                                    </Typography>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Paper>

                {/* CTA Section */}
                <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    <Box 
                        sx={{ 
                            backgroundColor: primaryColor,
                            borderRadius: 4,
                            p: isMobile ? 4 : 8,
                            textAlign: 'center',
                            mb: 10
                        }}
                    >
                        <Typography 
                            variant="h3" 
                            component="h2" 
                            fontWeight="bold"
                            sx={{ 
                                mb: 3,
                                color: 'white',
                                fontSize: isMobile ? '1.8rem' : '2.5rem'
                            }}
                        >
                            Ready to Simplify Your Meal Planning?
                        </Typography>

                        <Typography 
                            variant="h6" 
                            component="p"
                            sx={{ 
                                mb: 4,
                                color: 'white',
                                opacity: 0.9,
                                maxWidth: '800px',
                                mx: 'auto'
                            }}
                        >
                            Join thousands of home cooks who have transformed their meal preparation routine.
                        </Typography>

                        <Button 
                            variant="contained" 
                            size="large" 
                            sx={{ 
                                borderRadius: 2,
                                py: 1.5,
                                px: 4,
                                fontSize: '1.1rem',
                                backgroundColor: 'white',
                                color: primaryColor,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                }
                            }}
                        >
                            Get Started Now
                        </Button>
                    </Box>
                </motion.div>
            </motion.div>
        </Container>
    )
}
