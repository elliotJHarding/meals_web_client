import {
    Card,
    CardMedia,
    Select, Skeleton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import PrepTimeChip from "./chip/PrepTimeChip.tsx";
import ServesChip from "./chip/ServesChip.tsx";
import EffortChip from "./chip/EffortChip.tsx";
import {MealDto} from "@harding/meals-api";
import {useState} from "react";
import IconButton from "@mui/material-next/IconButton";
import {Add, Edit, ImageOutlined, Person, Remove, Timer} from "@mui/icons-material";
import {FormControl, InputLabel} from "@mui/material";
import {Chip, Slider} from "@mui/material-next";
import {formatPrepTime} from "../common/Utils.ts";
import MenuItem from "@mui/material/MenuItem";
import {Effort} from "@harding/meals-api";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material-next/Button";
import ButtonGroup from "@mui/material-next/ButtonGroup";
import {useMealUpdate} from "../../hooks/meal/useMealUpdate.ts";
import {AnimatePresence, motion} from "framer-motion";
import ConfirmCancelButtons from "../common/ConfirmCancelButtons.tsx";
import SelectImageDialog from "../dialog/SelectImageDialog.tsx";
import {useMealCreate} from "../../hooks/meal/useMealCreate.ts";
import {useNavigate} from "react-router-dom";
import RecipeLink from "./recipe/RecipeLink.tsx";
import {useTags} from "../../hooks/tags/useTags.ts";

const constant = {
    imageHeight: '100%',
    imageWidth: '100%',
    borderRadius: 3,
    cardPadding: 0
}

export default function MealDetails({meal, setMeal, newMeal, setNewMeal, initialEdit, mealId, loading}: {
    meal: MealDto,
    setMeal: any,
    newMeal: MealDto,
    setNewMeal: any,
    initialEdit: boolean | undefined,
    mealId: string | undefined,
    loading: boolean
}) {

    const [edit, setEdit] = useState(initialEdit != undefined ? initialEdit : false);
    const [selectImageDialogOpen, setSelectImageDialogOpen] = useState(false);

    const navigate = useNavigate();

    const {tags, findTag} = useTags();

    const {updateMeal} = useMealUpdate(() => {
        setEdit(false);
        setMeal({...newMeal});
    });

    const {createMeal} = useMealCreate((createdMeal) => {
        setEdit(false);
        setMeal({...newMeal});
        navigate(`/meals/${createdMeal?.id}`, { replace: true })
    });


    const handleEdit = () => setEdit(true);
    const handleCancel = () => {

        if (mealId == 'new') {
            navigate(-1);
        } else {
            setEdit(false);
            setNewMeal(meal);
        }
    };
    const handleConfirm = () => {
        if (mealId == 'new') {
            createMeal(newMeal);
        } else {
            updateMeal(newMeal);
        }
    }

    const handleNameOnChange = (newName : string) => setNewMeal({...newMeal, name: newName});
    const handlePrepTimeOnChange = (newPrepTime : number) => setNewMeal({...newMeal, prepTimeMinutes: newPrepTime});
    const handleServesIncrease = () => (newMeal.serves ?? 2) < 100 && setNewMeal({...newMeal, serves: (newMeal.serves ?? 2) + 1});
    const handleServesDecrease = () => (newMeal.serves ?? 2) > 1 && setNewMeal({...newMeal, serves: (newMeal.serves ?? 2) - 1});
    const handleEffortOnChange = (newEffort : Effort) => setNewMeal({...newMeal, effort: newEffort});
    const handleDescOnChange = (newDesc: string) => setNewMeal({...newMeal, description: newDesc});
    const handleTagsOnChange = (tagIds: number[]) => {
        setNewMeal({...newMeal, tags: tagIds.map(id => findTag(id))})
    }

    const skeleton =
        <Grid container spacing={3} sx={{flexGrow: 1, margin: 2}}
              component={motion.div}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
            <Grid xs={12} md={4} component={motion.div} layout>
                <Skeleton height={600}/>
            </Grid>
            <Grid xs={12} md={6} component={motion.div} layout>
                <Stack direction='row' component={motion.div} layout>
                    <Stack gap={0} sx={{py: 2, width: '100%', height: '100%'}} component={motion.div} layout>
                        <Skeleton variant='text' width={300} height={80}/>
                        <Box sx={{display: 'flex', gap: 1}}>
                            <Skeleton variant='text' width={70} height={50}/>
                            <Skeleton variant='text' width={70} height={50}/>
                            <Skeleton variant='text' width={70} height={50}/>
                        </Box >
                        <Skeleton variant='text' width={500} height={50}/>
                        <Skeleton variant='text' width={400} height={50}/>
                        <Skeleton variant='text' width={600} height={50}/>
                        <Skeleton variant='rounded' width={200} height={50}/>
                    </Stack>
                </Stack>
            </Grid>
            <Grid xs={12} md={2} component={motion.div} layout>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'end', height: '100%'}} component={motion.div} layout>
                    <Stack direction='row' justifyContent='end'>
                        <ButtonGroup>
                            <Button startIcon={<Edit/>} onClick={handleEdit} variant='text'>Edit</Button>
                        </ButtonGroup>
                    </Stack>
                </Box>
            </Grid>
        </Grid>


    const image =
        <Card sx={{height: constant.imageHeight, width: constant.imageWidth, borderRadius: constant.borderRadius}}
                component={motion.div} layout='position'>
            <CardMedia
                component="img"
                image={newMeal.image?.url}
                sx={{height: constant.imageHeight, width: constant.imageWidth, borderRadius: constant.borderRadius}}
                onClick={() => newMeal.name.length > 0 && setSelectImageDialogOpen(true)}
            />
        </Card>

    const displayMeal =
        <Grid container spacing={3} sx={{flexGrow: 1, margin: 2}}
              component={motion.div}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
            {meal.image?.url && (
                <Grid xs={12} md={4} component={motion.div} layout>
                    {image}
                </Grid>
            )}
            <Grid xs={12} md={meal.image?.url ? 6 : 8} component={motion.div} layout>
                    <Stack gap={2} sx={{py: 2, width: '100%', height: '100%'}} component={motion.div} layout='position'>
                        <Typography variant='h4' component={motion.div} layout='position'>
                            {meal.name}
                        </Typography>
                        <Box sx={{display: 'flex', gap: 1}} component={motion.div} layout='position'>
                            <PrepTimeChip prepTimeMinutes={meal.prepTimeMinutes ?? 30} size={'medium'}/>
                            <ServesChip serves={meal.serves ?? 2} size={'medium'}/>
                            {meal.effort != undefined && <EffortChip effort={meal.effort} size={'medium'}/>}
                        </Box>
                        {meal.description != '' && <Typography component={motion.div} layout='position'>{meal.description}</Typography>}
                        <Stack direction='row' component={motion.div} layout='position'>
                            <RecipeLink recipe={meal.recipe} newMeal={newMeal} setNewMeal={setNewMeal}
                                onConfirm={() => updateMeal(newMeal)}/>
                        </Stack>
                    </Stack>
            </Grid>
            <Grid xs={12} md={2} component={motion.div} layout>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'end', height: '100%'}} component={motion.div} layout>
                    <Stack direction='row' justifyContent='end'  component={motion.div} layout>
                        <ButtonGroup>
                            <Button startIcon={<Edit/>} onClick={handleEdit} variant='text'>Edit</Button>
                        </ButtonGroup>
                    </Stack>
                </Box>
            </Grid>
        </Grid>

    const imagePlaceholder =
        <Card
            sx={{height: constant.imageHeight, width: constant.imageWidth, borderRadius: constant.borderRadius}}
            onClick={() => newMeal.name.length > 0 && setSelectImageDialogOpen(true)}
        >
            <Stack direction='row' justifyContent='center' alignItems='center' sx={{height: '100%'}}>
                <ImageOutlined sx={{opacity: 0.3, width: 50, height: 50}} />
            </Stack>
        </Card>


    const editMeal =
        <Grid container spacing={3} sx={{flexGrow: 1, margin: 2}}
              component={motion.div}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
            <Grid xs={12} md={4} component={motion.div} layout>
                {newMeal.image == null ? imagePlaceholder : image}
            </Grid>
            <Grid xs={12} md={4} component={motion.div} layout>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}} component={motion.div} layout>
                    <TextField
                        label='Name'
                        value={newMeal.name}
                        autoComplete='off'
                        onChange={(event) => handleNameOnChange(event.target.value)}
                    />
                    <Stack spacing={1} direction='row' alignItems='center'>
                        <Timer/>
                        <Typography>{formatPrepTime(newMeal.prepTimeMinutes ?? 30)}</Typography>
                        <Slider
                            step={5}
                            min={5}
                            marks
                            max={120}
                            value={newMeal.prepTimeMinutes ?? 30}
                            defaultValue={30}
                            onChange={(_event: any, value: number) => handlePrepTimeOnChange(value)}
                        />
                    </Stack>
                    <Stack spacing={1} direction='row' alignItems='center'>
                        <IconButton size='small' onClick={handleServesDecrease}><Remove/></IconButton>
                        <Person/>
                        <Typography>{newMeal.serves ?? 2}</Typography>
                        <IconButton size='small' onClick={handleServesIncrease}><Add/></IconButton>
                        <FormControl fullWidth>
                            <InputLabel id="effort-label">Effort</InputLabel>
                            <Select
                                labelId="effort-label"
                                label="Effort"
                                value={newMeal.effort}
                                onChange={(event) => handleEffortOnChange(event.target.value as Effort)}
                            >
                                <MenuItem value="LOW">Low</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack direction='row'>
                        <FormControl fullWidth>
                            <InputLabel id="tags-filter-label">Tags</InputLabel>
                            <Select
                                labelId="tags-filter-label"
                                label="Tags"
                                multiple
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {(selected ?? []).map((value: number | undefined) => value !== undefined && (
                                            <Chip key={value} label={findTag(value)?.name}/>
                                        ))}
                                    </Box>
                                )}
                                value={(newMeal.tags ?? []).map(tag => tag.id)}
                                onChange={(event) => handleTagsOnChange(event.target.value as number[])}
                            >
                                {tags.map(tag => <MenuItem value={tag.id}>{tag.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack direction='row'>
                        <RecipeLink recipe={meal.recipe} newMeal={newMeal} setNewMeal={setNewMeal}
                                    onConfirm={() => updateMeal(newMeal)}/>
                    </Stack>
                </Box>
            </Grid>
            <Grid xs={12} md={4} >
                <Stack sx={{height: '100%', justifyContent: 'space-between'}} gap={2} component={motion.div} layout>
                    <TextField
                        multiline
                        fullWidth
                        label="Description"
                        value={newMeal.description}
                        onChange={(event) => handleDescOnChange(event.target.value)}
                    />
                    <ConfirmCancelButtons handleConfirm={handleConfirm} handleCancel={handleCancel}/>
                </Stack>
            </Grid>
        </Grid>

    return (
        <>
            <Card sx={{borderRadius: constant.borderRadius, width: '100%'}} component={motion.div} layout>
                <AnimatePresence>
                    {
                        loading ? skeleton :
                           edit ? editMeal :
                                  displayMeal
                    }
                </AnimatePresence>
                <SelectImageDialog
                    query={newMeal.name}
                    open={selectImageDialogOpen}
                    setOpen={setSelectImageDialogOpen}
                    onConfirm={(url) => {
                        setNewMeal({...newMeal, image: {url: url}});
                        setSelectImageDialogOpen(false);
                    }}
                />
            </Card>
        </>
    );
}