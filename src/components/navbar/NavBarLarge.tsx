import {Icon} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {pages} from "./Pages.tsx";
import Button from "@mui/material-next/Button";
import {Link as RouterLink} from 'react-router-dom'
import {PROPERTIES} from "../../constants/properties.ts";
import {useAuth} from "../../hooks/useAuth.ts";

export default function NavBarLarge() {
    const {auth} = useAuth(false);

    return <>
        <Icon sx={{fontSize: 60, opacity: 0.8, borderRadius: "50%", display: {xs: "none", md: "flex"}, mr: 1}}>
            <img src={PROPERTIES.LOGO_URL}/>
        </Icon>
        <Typography
            variant="h3"
            noWrap
            sx={{
                mr: 7,
                display: {xs: "none", md: "flex"},
                fontFamily: "Lora",
                fontWeight: 500,
                opacity: 0.8,
                textDecoration: "none",
            }}
        >
            {PROPERTIES.APP_NAME}
        </Typography>
        {auth.isAuthenticated() && (
            <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
                {pages.map((page) => (
                <Button
                    key={page.title}
                    startIcon={page.icon}
                    disableElevation={true}
                    component={RouterLink}
                    variant='elevated'
                    to={page.destination}
                    sx={{my: 2, mx: 1, backgroundColor: 'white'}}
                    size='large'
                >
                    {page.title}
                </Button>
            ))}
            </Box>
        )}
    </>;
}
