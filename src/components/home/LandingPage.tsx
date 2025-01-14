import {Card, Stack, Typography, useTheme} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {CalendarMonth, Explore, Restaurant} from "@mui/icons-material";
import {ReactNode} from "react";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";

type Option = {
    name: string;
    tagLine: string;
    icon: ReactNode;
    link: string;
}

const options : Option[] = [
    {
        name: "Meals",
        tagLine: "Add to a library of meals",
        icon: <Restaurant fontSize='large'/>,
        link: "/meals"
    },
    {
        name: "Plan",
        tagLine: "Create a meal plan",
        icon: <CalendarMonth fontSize='large'/>,
        link: "/plans"
    },
    {
        name: "Explore",
        tagLine: "Explore new recipes",
        icon: <Explore fontSize='large'/>,
        link: "/explore"
    },
]


export default function LandingPage() {

    const theme = useTheme();
    const navigate = useNavigate();

    // @ts-ignore
    const primary = theme.sys.color.primary;

    const Option = ({option} : {option: Option}) =>
        <Grid xs={4} sx={{mt: 5}}>
            <Card sx={{borderRadius: 5, ":hover": {cursor: 'pointer'}}} onClick={() => navigate(option.link)} component={motion.div}
                  whileHover={{ scale: 1.1, translateY: -20}}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Stack sx={{padding: 5}} direction="column" gap={5} alignItems="center">
                    <Box sx={{backgroundColor: primary, padding: 2, borderRadius: 999999, color: 'white'}}>
                        {option.icon}
                    </Box>
                    <Typography variant='h3'>{option.name}</Typography>
                    <Typography>{option.tagLine}</Typography>
                </Stack>
            </Card>
        </Grid>


    return (
        <Grid container spacing={5}>
            {options.map((option, index) => <Option key={index} option={option}/>)}
        </Grid>
    )
}