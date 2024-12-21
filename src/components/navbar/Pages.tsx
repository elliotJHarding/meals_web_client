import RestaurantIcon from "@mui/icons-material/Restaurant";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {Explore} from "@mui/icons-material";

export const pages = [
    {
        title: 'Meals',
        icon: <RestaurantIcon/>,
        destination: 'meals'
    },
    {
        title: 'Plans',
        icon: <CalendarMonthIcon/>,
        destination: 'plans'
    },
    {
        title: 'Explore',
        icon: <Explore/>,
        destination: 'explore'
    }
];
