import {useContext} from "react";
import {AuthContext, Token} from "../contexts/AuthContext.tsx";
import Auth from "../repository/Auth.ts";
import AuthRepository from "../repository/AuthRepository.ts";
import User from "../domain/User.ts";

export const useAuth = () => {
    const {auth, setAuth} : {auth : Auth, setAuth : any} = useContext(AuthContext);

    const repository = new AuthRepository();

    const login = (token : Token) => repository.login(token, (user : User) => setAuth(new Auth(user)));
    const whoami = () => repository.whoAmI((user: User) => setAuth(new Auth(user)), () => console.log("Failed Login"))

    if (!auth.isAuthenticated()) {
        whoami()
    }

    return {auth, login, whoami}

}