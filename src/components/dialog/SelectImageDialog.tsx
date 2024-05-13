import {
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    ImageList,
    ImageListItem, InputAdornment,
    Stack, TextField,
    Typography
} from "@mui/material";
import Button from "@mui/material-next/Button";
import {Camera, Cancel, Check, ImageOutlined, Link, Upload} from "@mui/icons-material";
import {useStockImages} from "../../hooks/useStockImages.ts";
import {useEffect, useState} from "react";
import {PexelsPhoto, PexelsSearchResponse} from "../../repository/StockImagesRepository.ts";
import Box from "@mui/material/Box";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Tab} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export default function SelectImageDialog({query, open, setOpen, onConfirm} : {query: string, open : boolean, setOpen : any, onConfirm : (url: string) => void}) {

    const handleCancel = () => setOpen(false);

    const handleSelectedOnChange = (text: string) => setSelected(text);

    const handleItemOnClick = (url: string) => setSelected(url);

    const handleTabChange = (_event: React.SyntheticEvent, tabId: string) => setTabValue(tabId);

    const {getStockPhotos} = useStockImages();

    const [images, setImages]: [images: PexelsPhoto[], setImages: any] = useState([]);
    const [selected, setSelected]: [selected: string, setSelected: any] = useState('')
    const [tabValue, setTabValue] = useState<string>('stock');

    useEffect(() => getStockPhotos(query, 1, (response: PexelsSearchResponse) => setImages(response.photos))
        , [query])

    const imageItems = images.map(image =>
        <ImageListItem key={image.id} onClick={() => handleItemOnClick(image.src.original)}>
            <img
                src={image.src.large}
                loading='lazy'
                style={{minWidth: 100, borderRadius: 5}}
            />
        </ImageListItem>
    )

    const imagePlaceholder =
        <Card sx={{borderRadius: 1}}>
            <Stack direction='row' justifyContent='center' alignItems='center' sx={{height: '100%'}}>
                <ImageOutlined sx={{opacity: 0.3, width: 50, height: 50}}/>
            </Stack>
        </Card>

    const image =
        <img src={selected} style={{minHeight: 300, objectFit: 'cover', borderRadius: 10}}/>

    return (
        <Dialog open={open}>
            <DialogContent>
                <Grid container>
                    <Grid xs={3}>
                        <Stack direction='column' gap={2} >
                            <Typography variant='h5'>
                                Select Image
                            </Typography>
                            {selected == '' ? imagePlaceholder : image}
                        </Stack>
                    </Grid>
                    <Grid xs={9}>
                        <TabContext value={tabValue}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <TabList onChange={handleTabChange}>
                                    <Tab icon={<Camera/>} iconPosition="start" label="Stock Photos" value="stock"/>
                                    <Tab icon={<Link/>} iconPosition="start" label="Url" value="url"/>
                                    <Tab icon={<Upload/>} iconPosition="start" label="Upload" value="upload"/>
                                </TabList>
                            </Box>
                            <TabPanel value="stock">
                                <ImageList cols={4} rowHeight={120}>
                                    {imageItems}
                                </ImageList>
                            </TabPanel>
                            <TabPanel value="url">
                                <TextField
                                    color='primary'
                                    value={selected}
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
                            </TabPanel>
                            <TabPanel value="upload">//TODO</TabPanel>
                        </TabContext>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button startIcon={<Check/>} variant='filled' onClick={() => onConfirm(selected)}>
                    Confirm
                </Button>
                <Button startIcon={<Cancel/>} onClick={handleCancel}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}