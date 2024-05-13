import {Dialog, DialogActions, DialogTitle, Typography} from "@mui/material";
import Button from "@mui/material-next/Button";
import {Cancel, Delete} from "@mui/icons-material";

export default function DeleteDialog({open, setOpen, onDelete} : {open : boolean, setOpen : any, onDelete : () => void}) {

    const handleCancel = () => setOpen(false);

    return (
        <Dialog open={open}>
            <DialogTitle>
                <Typography variant='h5'>
                   Delete Meal?
                </Typography>
            </DialogTitle>
            <DialogActions>
                <Button startIcon={<Delete/>} variant='filled' onClick={onDelete}>
                    Delete
                </Button>
                <Button startIcon={<Cancel/>} onClick={handleCancel}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}