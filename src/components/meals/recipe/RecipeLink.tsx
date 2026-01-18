import {useEffect, useState} from "react";
import Button from "@mui/material-next/Button";
import {Cancel, Check, Language, Link} from "@mui/icons-material";
import {InputAdornment, Skeleton, Stack, TextField, Typography} from "@mui/material";
import {MealDto, RecipeDto} from "@elliotJHarding/meals-api";
import IconButton from "@mui/material-next/IconButton";
import {MetaData} from "../../../repository/MetaDataRepository.ts";
import {useMetadataLookup} from "../../../hooks/useMetadataLookup.ts";

export default function RecipeLink({recipe, newMeal, setNewMeal, onConfirm} : {recipe: RecipeDto | undefined, newMeal: MealDto | undefined, setNewMeal : any, onConfirm: () => void}) {
    const {lookupMetadata, loading} = useMetadataLookup();
    useEffect(() => {
            newMeal?.recipe?.url != null && lookupMetadata(newMeal.recipe.url, (metaData) => setRecipeMetadata(metaData))
        }
    , [newMeal]);

    const [edit, setEdit] = useState<boolean>(false);

    const [recipeMetadata, setRecipeMetadata] = useState<MetaData>({})

    const handleOnClick = () => setEdit(true);

    const handleOnChange = (event: any) => setNewMeal({...newMeal, recipe: {...newMeal, url: event.target.value}});

    const handleCancel = () => setEdit(false);

    const handleConfirm = () => {
        setEdit(false);
        onConfirm();
        newMeal?.recipe?.url != null && lookupMetadata(newMeal.recipe.url, (metaData) => setRecipeMetadata(metaData));
    }

    const skeleton =
        <Stack direction='row' alignItems='center' gap={1}>
            <Skeleton width={60} height={50} variant={'rounded'}/>
            <Stack alignItems='start'>
                <Stack direction='row' gap={0.5}>
                    <Skeleton variant='text' width={200}/>
                </Stack>
                <Skeleton variant='text' width={100}/>
            </Stack>
        </Stack>

    const button =
        <Button startIcon={<Link/>} size='large' variant='filledTonal' onClick={handleOnClick}>Link Recipe</Button>

    const input =
        <Stack direction='row' alignItems='center' gap={0.5}>
            <TextField
                color='primary'
                value={newMeal?.recipe?.url}
                onChange={handleOnChange}
                fullWidth
                label='URL'
                size='small'
                sx={{borderRadius: 3, my: 1}}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Link/>
                        </InputAdornment>
                    ),
                    sx: {borderRadius: 4}
                }}
            />
            <IconButton onClick={handleConfirm}>
                <Check/>
            </IconButton>
            <IconButton onClick={handleCancel}>
                <Cancel/>
            </IconButton>
        </Stack>

    const loadedLink =
        <Stack direction='row' alignItems='center' gap={1}>
            <img style={{width: 60, height: 50, borderRadius: 10, objectFit: 'cover'}} src={recipeMetadata.image}/>
            <Stack alignItems='start'>
                <Typography fontWeight='bold' >{recipeMetadata.title}</Typography>
                <Stack direction='row' gap={0.5}>
                    <Language/>
                    <Typography >{recipeMetadata.site_name}</Typography>
                </Stack>
            </Stack>
        </Stack>

    const display =
        <Button variant='filledTonal' onClick={handleConfirm} sx={{borderRadius: 3, p: 1}} href={newMeal?.recipe?.url == null ? '' : newMeal.recipe.url} target="_blank">
            {loading ? skeleton : loadedLink}
        </Button>

    return (
        <>
            {edit ? input : recipe == null ? button : display}
        </>
    );
}
