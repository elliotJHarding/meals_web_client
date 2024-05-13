import {Fade, Stack, TextField} from "@mui/material";
import {Close} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {IngredientEdit} from "./Ingredients.tsx";

const timeOut = 200;

export default function IngredientEditRow({edit, ingredientEdits, setIngredientEdits} : {edit : IngredientEdit, ingredientEdits : IngredientEdit[], setIngredientEdits : any}) {

    const handleNewIngredientOnChange = (newInput : string) => {
        setIngredientEdits(
            ingredientEdits.filter(e => e.index != edit.index)
                .concat([{...edit, input: newInput}])
        )
    }

    const handleRemove = () => {
        setIngredientEdits(
            ingredientEdits.filter(e => e.index != edit.index)
                .map((e, index) => ({...e, index: index}))
        )
    }

    return (
        <Fade in timeout={timeOut}>
            <Stack direction='row' gap={0} sx={{width: {xs: '100%', md: '50%'}}}>
                <TextField
                    autoComplete='off'
                    size='small'
                    value={edit.input}
                    onChange={event => handleNewIngredientOnChange(event.target.value)}
                    fullWidth
                />
                <IconButton onClick={handleRemove}>
                    <Close/>
                </IconButton>
            </Stack>
        </Fade>

    )
}
