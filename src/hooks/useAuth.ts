import {useContext} from "react";
import {AuthContext, Token} from "../contexts/AuthContext.tsx";
import Auth from "../repository/Auth.ts";
import AuthRepository from "../repository/AuthRepository.ts";
import {AppUserDto} from "@elliotJHarding/meals-api";
import {useNavigate, useLocation} from "react-router-dom";

export const useAuth = (protect: boolean) => {
    const {auth, setAuth}: {auth: Auth, setAuth: any} = useContext(AuthContext);
    const location = useLocation();

    const repository = new AuthRepository();
    const navigate = useNavigate();

    const login = (token: Token) =>
        repository.login(token, (user: AppUserDto) => {
            setAuth(new Auth(user));
            // Redirect to intended destination or default to /plans
            const from = (location.state as any)?.from?.pathname || "/plans";
            navigate(from, {replace: true});
        });
    const whoami = () => repository.whoAmI(
        (user: AppUserDto) =>
            setAuth(new Auth(user)),
        () =>
            protect && navigate("/login", {replace: true})
    );
    const logout = () => repository.logout(
        setAuth(new Auth(null))
    );

    if (!auth.isAuthenticated()) {
        whoami();
    }

    return {auth, login, whoami, logout};

}