import './App.css'
import {Box, Container, Typography} from "@mui/material";

function App() {

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Material UI Create React App example in TypeScript
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default App
