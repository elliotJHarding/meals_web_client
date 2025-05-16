
import User from "../domain/User.ts";
import {Token} from "../contexts/AuthContext.tsx";
import {AxiosResponse} from "axios";
import ResourceRepository from "./ResourceRepository.ts";

type LoginRequest = {
    token: Token;
}

export default class AuthRepository extends ResourceRepository {

    whoAmI(onSuccess : (user : User) => void, onAuthFailure : () => void) {
        this.get("auth/whoami",
            (response : AxiosResponse) => onSuccess(response.data),
            // @ts-ignore
            (response : AxiosResponse) => {
                if (response.status === 403) {
                    onAuthFailure()
                } else {
                    console.error(response.statusText);
                }
            }
        )
    }

    login(token : Token, onSuccess : (user: User) => void) {
        const loginRequest: LoginRequest = {
            token: token
        }

        this.post("auth/login", loginRequest, (response : AxiosResponse) => {
            onSuccess(response.data)
        })
    }

    logout(onSuccess : () => void) {
        this.post("auth/logout", null, onSuccess);
    }

}