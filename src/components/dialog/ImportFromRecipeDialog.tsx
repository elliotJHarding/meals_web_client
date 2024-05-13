import {
    Dialog,
    DialogActions,
    DialogContent,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import Button from "@mui/material-next/Button";
import {Cancel, Check, Link} from "@mui/icons-material";
import {useState} from "react";
import {useMetadataLookup} from "../../hooks/useMetadataLookup.ts";
import Meal from "../../domain/Meal.ts";

export default function ImportFromRecipeDialog({open, setOpen, onConfirm} : {open : boolean, setOpen : any, onConfirm : (newMeal : Meal) => void}) {

    const handleCancel = () => setOpen(false);

    const handleSelectedOnChange = (text: string) => {
        setRecipeUrl(text);
        lookupMetadata(text, (metadata) => {
            setNewMeal({...newMeal,
                name: metadata.title ?? '',
                description: metadata.description ?? '',
                image: {url: metadata.image ?? ''}
            });
        });
    }

    const {lookupMetadata} = useMetadataLookup()

    const [recipeUrl, setRecipeUrl] = useState<string>('');
    const [newMeal, setNewMeal] = useState<Meal>({name: '', serves: 2, prepTimeMinutes: 20, description: '', ingredients: []});

    return (
        <Dialog open={open}>
            <DialogContent>
                <TextField
                    color='primary'
                    value={recipeUrl}
                    onChange={(event) => handleSelectedOnChange(event.target.value)}
                    fullWidth
                    placeholder='URL'
                    label='URL'
                    sx={{borderRadius: 3, my: 1}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Link/>
                            </InputAdornment>
                        ),
                    }}
                />
                <img src={newMeal?.image?.url}/>
                <Typography variant='h6'>{newMeal?.name}</Typography>
                <Typography variant='h6'>{newMeal?.description}</Typography>
            </DialogContent>
            <DialogActions>
                <Button startIcon={<Check/>} variant='filled' onClick={() => onConfirm(newMeal)}>
                    Confirm
                </Button>
                <Button startIcon={<Cancel/>} onClick={handleCancel}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}