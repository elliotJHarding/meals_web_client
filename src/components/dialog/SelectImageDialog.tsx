import {
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    ImageList,
    ImageListItem, 
    InputAdornment,
    Stack, 
    TextField,
    Typography,
    Skeleton,
    Chip,
    DialogTitle,
    IconButton
} from "@mui/material";
import Button from "@mui/material-next/Button";
import {Camera, Cancel, Check, ImageOutlined, Link, Upload, Close} from "@mui/icons-material";
import {useStockImages} from "../../hooks/useStockImages.ts";
import {useEffect, useState} from "react";
import {Photo, ImageSearchResponse} from "../../repository/StockImagesRepository.ts";
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

    const [images, setImages] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>('')
    const [tabValue, setTabValue] = useState<string>('stock');
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        if (query && tabValue === 'stock') {
            setLoading(true);
            getStockPhotos(query, (response: ImageSearchResponse) => {
                setImages(response.imageUrls);
                setLoading(false);
            });
        }
    }, [query, tabValue]);

    const imageItems = images.map((image, i) =>
        <ImageListItem 
            key={i}
            onClick={() => handleItemOnClick(image)}
            sx={{
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
                border: selected === image ? '3px solid primary.main' : '3px solid transparent',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 2
                }
            }}
        >
            <img
                src={image}
                loading='lazy'
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 4
                }}
            />
            {selected === image && (
                <Chip 
                    icon={<Check />} 
                    label="Selected" 
                    color="primary" 
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8
                    }}
                />
            )}
        </ImageListItem>
    )

    const imagePlaceholder =
        <Card sx={{borderRadius: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Stack direction='column' alignItems='center' spacing={2}>
                <ImageOutlined sx={{opacity: 0.3, width: 64, height: 64}}/>
                <Typography variant="body2" color="text.secondary">
                    No image selected
                </Typography>
            </Stack>
        </Card>

    const image = (
        <Card sx={{borderRadius: 2, overflow: 'hidden', height: 300}}>
            {imageLoading && (
                <Skeleton variant="rectangular" width="100%" height={300} />
            )}
            <img 
                src={selected} 
                alt="Selected image"
                style={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                    display: imageLoading ? 'none' : 'block'
                }}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
            />
        </Card>
    )

    return (
        <Dialog 
            open={open} 
            maxWidth="lg" 
            fullWidth
            PaperProps={{
                sx: { minHeight: '70vh' }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <Typography variant="h6">Select Image</Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleCancel}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                        <Stack direction='column' spacing={2}>
                            <Typography variant='h6' gutterBottom>
                                Preview
                            </Typography>
                            {selected === '' ? imagePlaceholder : image}
                        </Stack>
                    </Grid>
                    <Grid xs={12} md={8}>
                        <TabContext value={tabValue}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <TabList onChange={handleTabChange}>
                                    <Tab icon={<Camera/>} iconPosition="start" label="Stock Photos" value="stock"/>
                                    <Tab icon={<Link/>} iconPosition="start" label="Url" value="url"/>
                                    <Tab icon={<Upload/>} iconPosition="start" label="Upload" value="upload"/>
                                </TabList>
                            </Box>
                            <TabPanel value="stock" sx={{ p: 2 }}>
                                {loading ? (
                                    <Grid container spacing={1}>
                                        {[...Array(8)].map((_, index) => (
                                            <Grid xs={3} key={index}>
                                                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <ImageList cols={4} rowHeight={140} gap={8}>
                                        {imageItems}
                                    </ImageList>
                                )}
                            </TabPanel>
                            <TabPanel value="url" sx={{ p: 2 }}>
                                <TextField
                                    color='primary'
                                    value={selected}
                                    onChange={(event) => {
                                        handleSelectedOnChange(event.target.value);
                                        setImageLoading(true);
                                    }}
                                    fullWidth
                                    placeholder='Enter image URL'
                                    label='Image URL'
                                    variant="outlined"
                                    sx={{ borderRadius: 3 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <Link/>
                                            </InputAdornment>
                                        ),
                                    }}
                                    helperText="Enter a direct link to an image file"
                                />
                            </TabPanel>
                            <TabPanel value="upload" sx={{ p: 2 }}>
                                <Card 
                                    sx={{ 
                                        p: 4, 
                                        textAlign: 'center', 
                                        border: '2px dashed', 
                                        borderColor: 'divider',
                                        borderRadius: 2
                                    }}
                                >
                                    <Stack spacing={2} alignItems="center">
                                        <Upload sx={{ fontSize: 48, opacity: 0.5 }} />
                                        <Typography variant="h6" color="text.secondary">
                                            Upload Coming Soon
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            File upload functionality will be available in a future update
                                        </Typography>
                                    </Stack>
                                </Card>
                            </TabPanel>
                        </TabContext>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button 
                    startIcon={<Check/>} 
                    variant='filled' 
                    onClick={() => onConfirm(selected)}
                    disabled={!selected || selected.trim() === ''}
                    size="large"
                >
                    Confirm
                </Button>
                <Button 
                    startIcon={<Cancel/>} 
                    onClick={handleCancel}
                    size="large"
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}