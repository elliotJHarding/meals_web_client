import axios, {AxiosResponse} from "axios";

export default class Repository {
    protected url : string;

    constructor(url: string) {
         this.url = url;
    }

    getHeaders() {
        return {}
    }

    get(path : string, onSuccess : (response : AxiosResponse) => void) : void
    get(path : string, onSuccess : (response : AxiosResponse) => void, onFailure? : (response: AxiosResponse) => void) : void {
        const logError = (response: AxiosResponse) => console.error(response);
        axios
            .get(
                this.url + path,
                {
                    headers: this.getHeaders(),
                    withCredentials: true,
                }
            )
            .then(onSuccess)
            .catch(onFailure ?? logError);
    }

    post(path : string, data : any, onSuccess : (response : AxiosResponse) => void) : void {
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
            .catch(error => console.error(error));
    }

    update(path : string, data : any, onSuccess : () => void) : void {
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
            .catch(error => console.error(error));
    }

    delete(path : string, onSuccess : () => void) : void {
        axios
            .delete(
                this.url + path,
                {
                    headers: this.getHeaders(),
                    withCredentials: true,
                }
            )
            .then(onSuccess)
            .catch(error => console.error(error));
    }

}