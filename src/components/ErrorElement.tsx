import {Container, Typography} from "@mui/material";

export default function ErrorElement() {
    return(
        <Container sx={{my: {sm: 0, md: 4}}}>
            <Typography variant='h1'>404</Typography>
        </Container>

    )
}