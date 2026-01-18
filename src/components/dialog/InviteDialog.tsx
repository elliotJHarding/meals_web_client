import {Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useTheme} from "@mui/material";
import Button from "@mui/material-next/Button";
import {Cancel, ContentCopy} from "@mui/icons-material";
import {FamilyGroupDto} from "@harding/meals-api";

export default function InviteDialog({open, setOpen, group}: {
    open: boolean,
    setOpen: (open: boolean) => void,
    group: FamilyGroupDto
}) {

    const handleCancel = () => setOpen(false);

    const theme = useTheme();

    // @ts-ignore
    const background = theme.sys.color.secondaryContainer;

    return (
        <Dialog open={open}>
            <DialogTitle>
                <Typography variant='h5'>
                    Invite
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Stack direction='row' alignItems='center' gap={1} sx={{backgroundColor: background, borderRadius: 2, px: 2, py: 1}}>
                    <Typography fontFamily='Courier New' fontWeight='bold'>
                        {import.meta.env.VITE_CLIENT_HOST + group.uuid}
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button startIcon={<ContentCopy/>} variant='filled' sx={{borderRadius: 2}}>Copy</Button>
                <Button startIcon={<Cancel/>} onClick={handleCancel}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}