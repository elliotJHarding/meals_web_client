import {
    Card,
    CardMedia,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import PrepTimeChip from "./chip/PrepTimeChip.tsx";
import ServesChip from "./chip/ServesChip.tsx";
import EffortChip from "./chip/EffortChip.tsx";
import Meal from "../../domain/Meal.ts";
import {useState} from "react";
import IconButton from "@mui/material-next/IconButton";
import {Add, Edit, ImageOutlined, Person, Remove, Timer} from "@mui/icons-material";
import {FormControl, InputLabel} from "@mui/material";
import {Slider} from "@mui/material-next";
import {formatPrepTime} from "../common/Utils.ts";
import MenuItem from "@mui/material/MenuItem";
import Effort from "../../domain/Effort.ts";
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

const constant = {
    imageHeight: 250,
    imageWidth: 300,
    borderRadius: 3,
    cardPadding: 0
}

export default function MealDetails({meal, setMeal, initialEdit, mealId} : {meal : Meal, setMeal : any, initialEdit : boolean | undefined, mealId: string | undefined}) {

    const [edit, setEdit] = useState(initialEdit != undefined ? initialEdit : false);
    const [newMeal, setNewMeal] = useState(meal);
    const [selectImageDialogOpen, setSelectImageDialogOpen] = useState(false);

    const navigate = useNavigate();

    const {updateMeal} = useMealUpdate(() => {
        setEdit(false);
        setMeal({...newMeal});
    });

    const {createMeal} = useMealCreate((createdMeal) => {
        setEdit(false);
        setMeal({...newMeal});
        navigate(`/meals/${createdMeal?.id}`)
    });

    const handleEdit = () => setEdit(true);
    const handleCancel = () => {
        setEdit(false);
        setNewMeal(meal);
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
    const handleServesIncrease = () => newMeal.serves < 100 && setNewMeal({...newMeal, serves: newMeal.serves + 1});
    const handleServesDecrease = () => newMeal.serves > 1 && setNewMeal({...newMeal, serves: newMeal.serves - 1});
    const handleEffortOnChange = (newEffort : Effort) => setNewMeal({...newMeal, effort: newEffort});
    const handleDescOnChange = (newDesc: string) => setNewMeal({...newMeal, description: newDesc});


    const displayMeal =
        <Grid container spacing={3} sx={{flexGrow: 1, margin: 2}}
              component={motion.div}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
            <Grid xs={12} md={4} component={motion.div} layout>
                <CardMedia
                    component="img"
                    image={meal.image?.url}
                    sx={{ height: constant.imageHeight, borderRadius: constant.borderRadius}}
                />
            </Grid>
            <Grid xs={12} md={6} component={motion.div} layout>
                <Stack direction='row' component={motion.div} layout>
                    <Stack gap={2} sx={{py: 2}} component={motion.div} layout>
                        <Typography variant='h4'>
                            {meal.name}
                        </Typography>
                        <Box sx={{display: 'flex', gap: 1}}>
                            <PrepTimeChip prepTimeMinutes={meal.prepTimeMinutes} size={'medium'}/>
                            <ServesChip serves={meal.serves} size={'medium'}/>
                            {meal.effort != undefined && <EffortChip effort={meal.effort} size={'medium'}/>}
                        </Box>
                        {meal.description != '' && <Typography>{meal.description}</Typography>}
                        <Stack direction='row'>
                            <RecipeLink recipe={meal.recipe} newMeal={newMeal} setNewMeal={setNewMeal}
                                onConfirm={() => updateMeal(newMeal)}/>
                        </Stack>
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

    const imagePlaceholder =
        <Card
            sx={{height: constant.imageHeight, borderRadius: constant.borderRadius}}
            onClick={() => newMeal.name.length > 0 && setSelectImageDialogOpen(true)}
        >
            <Stack direction='row' justifyContent='center' alignItems='center' sx={{height: '100%'}}>
                <ImageOutlined sx={{opacity: 0.3, width: 50, height: 50}} />
            </Stack>
        </Card>

    const image =
        <Card>
            <CardMedia
                component="img"
                image={newMeal.image?.url}
                sx={{height: constant.imageHeight, borderRadius: constant.borderRadius}}
                onClick={() => newMeal.name.length > 0 && setSelectImageDialogOpen(true)}
            />
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
                        <Typography>{formatPrepTime(newMeal.prepTimeMinutes)}</Typography>
                        <Slider
                            step={5}
                            min={5}
                            marks
                            max={120}
                            value={newMeal.prepTimeMinutes}
                            defaultValue={30}
                            onChange={(_event: any, value: number) => handlePrepTimeOnChange(value)}
                        />
                    </Stack>
                    <Stack spacing={1} direction='row' alignItems='center'>
                        <IconButton size='small' onClick={handleServesDecrease}><Remove/></IconButton>
                        <Person/>
                        <Typography>{newMeal.serves}</Typography>
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
                    { edit ? editMeal : displayMeal }
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