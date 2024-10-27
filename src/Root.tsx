import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import NavBar from "./components/navbar/NavBar.tsx";
import Box from "@mui/material/Box";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function Root() {
    return (
        <Box>
            <NavBar/>
            <Container sx={{my: {sm: 0, md: 4}}}>
                <Outlet/>
            </Container>
        </Box>
    )
}
