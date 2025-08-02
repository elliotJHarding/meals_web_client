import {useContext} from "react";
import {AuthContext, Token} from "../contexts/AuthContext.tsx";
import Auth from "../repository/Auth.ts";
import AuthRepository from "../repository/AuthRepository.ts";
import User from "../domain/User.ts";
import {useNavigate} from "react-router-dom";

export const useAuth = () => {
    const {auth, setAuth} : {auth : Auth, setAuth : any} = useContext(AuthContext);

    const repository = new AuthRepository();
    const navigate = useNavigate();

    const login = (token : Token) =>
        repository.login(token, (user : User) => {
            setAuth(new Auth(user));
            navigate("/plans");
        })
    const whoami = () => repository.whoAmI((user: User) => setAuth(new Auth(user)), () => console.log("Failed Login"))
    const logout = ()=>  repository.logout(
        setAuth(new Auth(null))
    );

    if (!auth.isAuthenticated()) {
        whoami()
    }

    return {auth, login, whoami, logout}

}