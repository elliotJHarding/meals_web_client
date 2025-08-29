import {Card, CardMedia, Stack, Typography, Checkbox} from "@mui/material";
import {useAuth} from "../../hooks/useAuth.ts";
import Box from "@mui/material/Box";
import {GroupAdd, Groups3, Mail} from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {useGroup} from "../../hooks/group/useGroup.ts";
import Button from "@mui/material-next/Button";
import {useState} from "react";
import InviteDialog from "../dialog/InviteDialog.tsx";
import {useCalendars} from "../../hooks/calendar/useCalendars.ts";
import Calendar from "../../domain/Calendar.ts";
import {motion} from "framer-motion";

export default function Profile() {

    const {auth} = useAuth(true);

    const {group, setGroup, createGroup} = useGroup()

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    const {calendars, setCalendars, updateActiveCalendars} = useCalendars();

    const CalendarItem = ({calendar} : {calendar: Calendar}) => {
        const onClick = () => {
            setCalendars(calendars.map(c => c.id == calendar.id ? {...c, active: !c.active} : c));
            updateActiveCalendars(calendars.filter(c => c.active).map(c => c.id))
        }
        return (
            <Card sx={{paddingX: 1, cursor: 'pointer'}} onClick={onClick} component={motion.div}
                  whileHover={{scale: 1.01}}
                  whileTap={{scale: 0.99}}
                  transition={{type: "spring", stiffness: 400, damping: 17}}>
                <Stack direction={'row'} key={calendar.id} gap={1} alignItems={'center'}>
                    <Box sx={{width: 20, height: 20, backgroundColor: calendar.colour, borderRadius: 99999}}/>
                    <Typography sx={{padding: 1}}>{calendar.name}</Typography>
                    <Box sx={{flexGrow: 1}}/>
                    <Checkbox checked={calendar.active}/>
                </Stack>
            </Card>
        )
    }

    const calendarItems = calendars.map(calendar => <CalendarItem calendar={calendar}/>)

    const onInvite = () => {
        createGroup(uuid => setGroup({uuid: uuid, users: []}));
        setInviteDialogOpen(true)
    }

    const onJoin = () => {

    }

    const GroupList = () =>
        group.users.map(user =>
                <Stack direction={'row'} gap={2} alignItems={'center'} padding={2}>
                    <CardMedia image={user?.pictureUrl} sx={{borderRadius: 99999, height: 40, width: 40}}/>
                    <Typography variant='h6'>{user?.name}</Typography>
                </Stack>
        );

    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <Stack direction='row' gap={3} alignItems={'center'} sx={{padding: 5}}>
                    <CardMedia image={auth.getUser()?.pictureUrl} sx={{borderRadius: 99999, height: 100, width: 100}}/>
                    <Typography variant='h4'>{auth.getUser()?.name}</Typography>
                </Stack>
            </Card>
            <Card>
                <Box sx={{padding: 3}}>
                    <Stack direction={'row'} gap={2} alignItems={'center'}>
                        <Groups3/>
                        <Typography variant={'h5'}>Family Group</Typography>
                        <Box sx={{flexGrow: 1}}/>
                        <InviteDialog open={inviteDialogOpen} setOpen={setInviteDialogOpen} group={group}/>
                        <Button size='large' variant='filled' startIcon={<Mail/>} onClick={onInvite}>Invite</Button>
                        <Button size='large' variant='filledTonal' startIcon={<GroupAdd/>} onClick={onJoin}>Join</Button>
                    </Stack>
                    <GroupList/>
                </Box>
            </Card>
            <Card>
                <Box sx={{padding: 3}}>
                    <Stack gap={1}>
                        <Stack direction={'row'} gap={2} alignItems={'center'}>
                            <CalendarMonthIcon/>
                            <Typography variant={'h5'}>Linked Calendars</Typography>
                        </Stack>
                        <Stack gap={1}>
                            {calendarItems}
                        </Stack>
                    </Stack>
                </Box>
            </Card>
        </Stack>
    )
}