import axios, {AxiosResponse} from "axios";
import {toastService} from "../contexts/ToastContext.tsx";

export default class Repository {
    protected url : string;

    constructor(url: string) {
         this.url = url;
    }

    getHeaders() {
        return {}
    }

    get(path : string, onSuccess : (response : AxiosResponse) => void, onFailure? : (response: AxiosResponse) => void, suppressToast?: boolean) : void {
        axios
            .get(
                this.url + path,
                {
                    headers: this.getHeaders(),
                    withCredentials: true,
                }
            )
            .then(onSuccess)
            .catch(error => {
                console.error(error);
                if (!suppressToast) {
                    toastService.showError('Failed to load data');
                }
                if (onFailure) {
                    onFailure(error);
                }
            });
    }

    post(path : string, data : any, onSuccess : (response : AxiosResponse) => void, suppressToast?: boolean) : void {
        axios
            .post(
                this.url + path,
                data,
                {
                    headers: this.getHeaders(),
                    withCredentials: true,
                }
            )
            .then(onSuccess)
            .catch(error => {
                console.error(error);
                if (!suppressToast) {
                    toastService.showError('Failed to save data');
                }
            });
    }

    update(path : string, data : any, onSuccess : () => void, suppressToast?: boolean) : void {
        axios
            .put(
                this.url + path,
                data,
                {
                    headers: this.getHeaders(),
                    withCredentials: true,
                }
            )
            .then(onSuccess)
            .catch(error => {
                console.error(error);
                if (!suppressToast) {
                    toastService.showError('Failed to update data');
                }
            });
    }

    delete(path : string, onSuccess : () => void, suppressToast?: boolean) : void {
        axios
            .delete(
                this.url + path,
                {
                    headers: this.getHeaders(),
                    withCredentials: true,
                }
            )
            .then(onSuccess)
            .catch(error => {
                console.error(error);
                if (!suppressToast) {
                    toastService.showError('Failed to delete data');
                }
            });
    }

}