import * as React from "react";
import {BottomNavigation, BottomNavigationAction, Icon, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import {pages} from "./Pages.tsx";
import {Link as RouterLink} from "react-router-dom";
import {PROPERTIES} from "../../constants/properties.ts";
import {useAuth} from "../../hooks/useAuth.ts";

export default function NavBarSmall() {
    const {auth} = useAuth(false);
    const [value, setValue] = React.useState(0);

    const navigationOnChange = (_event : any, newValue : number) => setValue(newValue);

    return <>
        <Icon sx={{fontSize: 40, opacity: 0.8, display: {xs: "flex", md: "none"}, mr: 1}}>
            <img src={PROPERTIES.LOGO_URL}/>
        </Icon>
        <Typography
            variant="h5"
            noWrap
            sx={{
                mr: 2,
                display: {xs: "flex", md: "none"},
                flexGrow: 0,
                fontFamily: "Lora",
                fontWeight: 500,
                fontSize: 30,
                opacity: 0.8,
                textDecoration: "none",
            }}
        >
            {PROPERTIES.APP_NAME}
        </Typography>
        {auth.isAuthenticated() && (
            <Paper sx={{
                display: {xs: "block", md: "none"},
                pb: 1,
                position: "fixed",
                bottom: 0,
                top: 'auto',
                left: 0,
                right: 0,
            }}
            >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={navigationOnChange}
                >
                    {pages.map(page =>
                        <BottomNavigationAction key={page.title} label={page.title} icon={page.icon} component={RouterLink}
                                                to={page.destination}/>
                    )}
                </BottomNavigation>
            </Paper>
        )}
    </>;
}
