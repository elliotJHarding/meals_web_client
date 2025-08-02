import {Icon} from "@mui/material";
import Typography from "@mui/material/Typography";
import {PROPERTIES} from "../../constants/properties.ts";

export default function NavBarMinimal() {
    return (
        <>
            {/* Desktop Logo */}
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

            {/* Mobile Logo */}
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
                    fontFamily: "Montserrat",
                    fontWeight: 700,
                    fontSize: 30,
                    opacity: 0.8,
                    textDecoration: "none",
                }}
            >
                {PROPERTIES.APP_NAME}
            </Typography>
        </>
    );
}