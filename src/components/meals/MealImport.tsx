import {useMetadataLookup} from "../../hooks/useMetadataLookup.ts";
import {useEffect, useState} from "react";
import Meal from "../../domain/Meal.ts";
import {Card, CardMedia, InputAdornment, Stack, TextField, Typography} from "@mui/material";
import {Download, Link} from "@mui/icons-material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Button from "@mui/material-next/Button";
import {useNavigate} from "react-router-dom";

export default function MealImport() {

    const navigate = useNavigate();

    const {lookupMetadata} = useMetadataLookup()

    const checkClipboardForRecipe = async (): Promise<string> => {
        const clipboardContent = await navigator.clipboard.read();
        for (const item of clipboardContent) {
            if (item.types.includes('text/plain')) {
                const blob = await item.getType('text/plain')
                const blobText = await blob.text();

                if (blobText.startsWith("http")) {
                    return blobText;
                }
            }
        }
        return '';
    }

    useEffect(() => {
        checkClipboardForRecipe().then(url => {
            setRecipeUrl(url);
            if (url != '') {
                lookupMetadata(url, (metadata) => {
                    setNewMeal({...newMeal,
                        name: metadata.title ?? '',
                        description: metadata.description ?? '',
                        image: {url: metadata.image ?? ''},
                        recipe: {
                            title: metadata.title ?? '',
                            url: url,
                            image: {url: metadata.image ?? ''},
                        }
                    });
                });
            }
        })
    }, [])

    const [recipeUrl, setRecipeUrl] = useState<string>('');
    const [newMeal, setNewMeal] = useState<Meal>({name: '', serves: 2, prepTimeMinutes: 20, description: '', ingredients: [], tags: []});

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

    const handleImportOnClick = () => navigate("/meals/new", {state: {newMeal: newMeal}});

    const PlaceHolderMeal = () =>
        <Card sx={{padding: 20}}>
            <Stack direction="row" spacing={2}>
                <RestaurantIcon/>
                <Typography>Import Recipe</Typography>
            </Stack>
        </Card>

    const ImportedMeal = ({meal} : {meal: Meal}) =>
        <Card sx={{padding: 3}}>
            <CardMedia
                component='img'
                image={meal.image?.url}
                sx={{borderRadius: 3, marginBottom: 2}}/>
            <Typography variant='h5'>{meal?.name}</Typography>
            <Typography>{meal?.description}</Typography>
        </Card>

    return (
        <Stack direction="column" spacing={2}>
            <TextField
                color='primary'
                value={recipeUrl}
                onChange={(event) => handleSelectedOnChange(event.target.value)}
                fullWidth
                placeholder='URL'
                label='URL'
                sx={{borderRadius: 3}}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Link/>
                        </InputAdornment>
                    ),
                }}
            />
            {newMeal.name == '' ? <PlaceHolderMeal /> : <ImportedMeal meal={newMeal} />}
            <Button disabled={newMeal.name == ''} startIcon={<Download/>} variant='filled' onClick={handleImportOnClick}>Import</Button>
        </Stack>

    )
}