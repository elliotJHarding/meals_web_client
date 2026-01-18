import {Card, CardMedia, Stack, Typography, Checkbox} from "@mui/material";
import {useAuth} from "../../hooks/useAuth.ts";
import Box from "@mui/material/Box";
import {GroupAdd, Groups3, Mail} from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {useGroup} from "../../hooks/group/useGroup.ts";
import Button from "@mui/material-next/Button";
import {useState, useEffect} from "react";
import InviteDialog from "../dialog/InviteDialog.tsx";
import {useCalendars} from "../../hooks/calendar/useCalendars.ts";
import {useLinkCalendar} from "../../hooks/calendar/useLinkCalendar.ts";
import {Calendar} from "@elliotJHarding/meals-api";
import CalendarRepository from "../../repository/CalendarRepository.ts";
import {motion} from "framer-motion";

export default function Profile() {

    const {auth} = useAuth(true);

    const {group, setGroup, createGroup} = useGroup()

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

    // Check authorization status
    const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
    const [authLoading, setAuthLoading] = useState<boolean>(true);
    const { authorizeCalendar, authorizing } = useLinkCalendar();

    const {calendars, setCalendars, loading, updateActiveCalendars} = useCalendars();

    useEffect(() => {
        const repository = new CalendarRepository();
        repository.isAuthorized((authorized) => {
            setIsAuthorized(authorized);
            setAuthLoading(false);
        });
    }, []);

    const CalendarItem = ({calendar} : {calendar: Calendar}) => {
        const onClick = () => {
            // Calculate the new calendars array with the toggled item
            const updatedCalendars = calendars.map(c => c.id == calendar.id ? {...c, active: !c.active} : c);

            // Update local state
            setCalendars(updatedCalendars);

            // Send the correct active calendar IDs to backend
            const activeCalendarIds = updatedCalendars.filter(c => c.active).map(c => c.id);
            updateActiveCalendars(activeCalendarIds);
        }

        return (
            <Box
                sx={{
                    py: 0.75,
                    px: 1.25,
                    backgroundColor: calendar.active ? 'transparent' : 'grey.50',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: calendar.active ? 'tertiary' : 'grey.200',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: calendar.active ? 1 : 0.6,
                    boxShadow: calendar.active ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                onClick={onClick}
                component={motion.div}
                whileHover={{scale: 1.01, opacity: 1}}
                whileTap={{scale: 0.99}}
                transition={{type: "spring", stiffness: 400, damping: 17}}
            >
                <Stack direction="row" gap={1} alignItems="center">
                    <Box sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: calendar.colour,
                        borderRadius: 1,
                        border: '2px solid',
                        borderColor: calendar.active ? calendar.colour : 'grey.400',
                        opacity: calendar.active ? 1 : 0.7
                    }} />
                    <Typography
                        variant="body2"
                        fontWeight={calendar.active ? "600" : "500"}
                        color={calendar.active ? "text.primary" : "text.secondary"}
                    >
                        {calendar.name}
                    </Typography>
                    <Box sx={{flexGrow: 1}} />
                    <Checkbox
                        checked={calendar.active}
                        size="small"
                        sx={{
                            color: calendar.active ? 'tertiary' : 'grey.400',
                            padding: 0.5
                        }}
                    />
                </Stack>
            </Box>
        )
    }

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
                    <Stack gap={2}>
                        <Stack direction="row" gap={2} alignItems="center">
                            <CalendarMonthIcon />
                            <Typography variant="h5">Linked Calendars</Typography>
                            <Box sx={{flexGrow: 1}} />
                            {!authLoading && (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Box sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: isAuthorized ? 'success.main' : 'error.main'
                                    }} />
                                    <Typography variant="body2" fontWeight="600" color="text.secondary">
                                        {isAuthorized ? 'Connected' : 'Not Connected'}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>

                        {(loading || authLoading) ? (
                            <Box sx={{
                                p: 2,
                                backgroundColor: 'grey.50',
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: 'grey.200'
                            }}>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Loading...
                                </Typography>
                            </Box>
                        ) : !isAuthorized ? (
                            /* State 1: Not Authorized */
                            <Box sx={{
                                p: 2,
                                backgroundColor: 'grey.50',
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: 'grey.200'
                            }}>
                                <Stack spacing={2} alignItems="center">
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Connect your Google Calendar to link calendars and enable calendar-based features
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        startIcon={<CalendarMonthIcon />}
                                        onClick={authorizeCalendar}
                                        disabled={authorizing}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {authorizing ? 'Connecting...' : 'Connect Google Calendar'}
                                    </Button>
                                </Stack>
                            </Box>
                        ) : calendars.length === 0 ? (
                            /* State 2: Authorized but No Calendars */
                            <Box sx={{
                                p: 2,
                                backgroundColor: 'grey.50',
                                borderRadius: 2,
                                border: '2px solid',
                                borderColor: 'grey.200'
                            }}>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    No calendars found. Make sure you have calendars in your Google account.
                                </Typography>
                            </Box>
                        ) : (
                            /* State 3: Authorized with Calendars */
                            <Stack gap={0.5}>
                                {calendars.map(calendar => <CalendarItem key={calendar.id} calendar={calendar} />)}
                            </Stack>
                        )}
                    </Stack>
                </Box>
            </Card>
        </Stack>
    )
}