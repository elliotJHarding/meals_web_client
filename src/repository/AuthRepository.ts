import {AuthenticationApi, AppUserDto, LoginRequest as ApiLoginRequest, Configuration} from "@elliotJHarding/meals-api";
import {Token} from "../contexts/AuthContext.tsx";
import {toastService} from "../contexts/ToastContext.tsx";
import axios from "axios";

// Local type to match our Token structure with API's LoginRequest
type LoginRequest = {
    token: Token;
};

export default class AuthRepository {
    private api: AuthenticationApi;

    constructor() {
        const configuration = new Configuration({
            basePath: import.meta.env.VITE_REPOSITORY_URL,
        });

        const axiosInstance = axios.create({
            withCredentials: true,
        });

        this.api = new AuthenticationApi(configuration, import.meta.env.VITE_REPOSITORY_URL, axiosInstance);
    }

    whoAmI(onSuccess: (user: AppUserDto) => void, onAuthFailure: () => void) {
        this.api.whoAmI()
            .then(response => {
                onSuccess(response.data);
            })
            .catch(error => {
                if (error.response?.status === 403) {
                    onAuthFailure();
                } else {
                    console.error(error);
                }
            });
    }

    login(token: Token, onSuccess: (user: AppUserDto) => void) {
        const loginRequest: any = {
            token: token
        };

        this.api.login(loginRequest)
            .then(response => {
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Login failed');
            });
    }

    logout(onSuccess: () => void) {
        this.api.logout()
            .then(() => {
                onSuccess();
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Logout failed');
            });
    }
}