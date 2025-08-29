import './App.css'
import Root from "./Root.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MealsPage from "./components/meals/MealsPage.tsx";
import Plans from "./components/plans/Plans.tsx";
import {CssVarsProvider, extendTheme} from "@mui/material-next";
import {AuthProvider} from "./contexts/AuthContext.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import MealPage from "./components/meals/MealPage.tsx";
import {createTheme, responsiveFontSizes, ThemeProvider} from "@mui/material/styles";
import PlanWizard from "./components/plans/wizard/PlanWizard.tsx";
import type {} from '@mui/material/themeCssVarsAugmentation';
import {GlobalStyles} from "@mui/material";
import {CheckCircle, RadioButtonUnchecked} from "@mui/icons-material";
import LandingPage from "./components/home/LandingPage.tsx";
import Profile from "./components/user/Profile.tsx";
import Logout from "./components/user/Logout.tsx";
import LinkCalendar from "./components/calendar/LinkCalendar.tsx";
import LoginPage from "./components/auth/LoginPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";

export default function App() {

    const router  = createBrowserRouter([
        { path: "/", element: <Root/>, children: [
                { path: "/" , element: <LandingPage/>},
                { path: "login", element: <LoginPage/>},
                { path: "meals", element: <ProtectedRoute><MealsPage/></ProtectedRoute>},
                { path: "meals/:mealId", element: <ProtectedRoute><MealPage/></ProtectedRoute>},
                { path: "plans", element: <ProtectedRoute><Plans/></ProtectedRoute> },
                { path: "plans/create/:step", element: <ProtectedRoute><PlanWizard/></ProtectedRoute>},
                { path: "profile", element: <ProtectedRoute><Profile/></ProtectedRoute>},
                { path: "logout", element: <ProtectedRoute><Logout/></ProtectedRoute>},
                { path: "calendar/link", element: <ProtectedRoute><LinkCalendar/></ProtectedRoute>},
            ]}
    ])

    let theme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#50652c',
            },
            secondary: {
                main: '#6b9992',
            },
            background: {
                default: '#f5f5f5',
                paper: '#e7eeda',
            },
        },
    });

    theme = responsiveFontSizes(theme);

    const md3theme = extendTheme({
        components: {
            MuiCard: {
                defaultProps: {
                    variant: 'outlined',
                    sx: {
                        borderRadius: 3,
                    }
                }
            },
            MuiDialog: {
                defaultProps: {
                    PaperProps: {
                        sx: {
                            borderRadius: 5,
                            padding: 3,
                        }
                    }
                }
            },
            MuiTypography: {
                defaultProps: {
                    fontFamily: 'Lora'
                }
            },
            MuiCheckbox: {
                defaultProps: {
                    icon: <RadioButtonUnchecked/>,
                    checkedIcon: <CheckCircle/>,
                }
            }
        },
        ref: {
            palette: {
                primary: {
                    "0": "#000000",
                    "10": "#121F00",
                    "20": "#233602",
                    "30": "#394D17",
                    "40": "#50652C",
                    "50": "#687F43",
                    "60": "#81995A",
                    "70": "#9BB472",
                    "80": "#B6CF8B",
                    "90": "#D2ECA5",
                    "95": "#E0FAB2",
                    "99": "#F9FFE6",
                    "100": "#FFFFFF"
                },
                secondary: {
                    "0": "#000000",
                    "10": "#181D10",
                    "20": "#2D3223",
                    "30": "#434939",
                    "40": "#5B614F",
                    "50": "#747967",
                    "60": "#8D9380",
                    "70": "#A8AE99",
                    "80": "#C4C9B4",
                    "90": "#E0E5CF",
                    "95": "#EEF3DD",
                    "99": "#FAFFE8",
                    "100": "#FFFFFF"
                },
                tertiary: {
                    "0": "#000000",
                    "10": "#03201D",
                    "20": "#1A3532",
                    "30": "#314C48",
                    "40": "#486460",
                    "50": "#607C79",
                    "60": "#7A9692",
                    "70": "#94B1AD",
                    "80": "#AFCCC8",
                    "90": "#CAE9E4",
                    "95": "#D9F7F2",
                    "99": "#F2FFFC",
                    "100": "#FFFFFF"
                },
                neutral: {
                    "0": "#000000",
                    "10": "#1B1C19",
                    "17": "#262623",
                    "20": "#30312D",
                    "22": "#3B3C38",
                    "30": "#474743",
                    "40": "#5F5E5A",
                    "50": "#787773",
                    "60": "#92918C",
                    "70": "#ACABA6",
                    "80": "#C8C6C1",
                    "90": "#E4E2DD",
                    "92": "#F3F1EB",
                    "95": "#F3F1EB",
                    "96": "#FBF9F4",
                    "99": "#FEFCF6",
                    "100": "#FFFFFF"
                },
                error: {
                    "0": "#000000",
                    "10": "#1B1C19",
                    "20": "#30312D",
                    "30": "#474743",
                    "40": "#5F5E5A",
                    "50": "#787773",
                    "60": "#92918C",
                    "70": "#ACABA6",
                    "80": "#C8C6C1",
                    "90": "#E4E2DD",
                    "95": "#F3F1EB",
                    "99": "#FEFCF6",
                    "100": "#FFFFFF"
                },
            }
        }
    });

    return (
    <>
        <ThemeProvider theme={md3theme}>
            <CssVarsProvider theme={md3theme}>
                <GlobalStyles styles={{html: {backgroundColor: theme.palette.background.default}}}/>
                <AuthProvider>
                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                        <RouterProvider router={router}/>
                    </GoogleOAuthProvider>
                </AuthProvider>
            </CssVarsProvider>
        </ThemeProvider>
    </>
  )
}
