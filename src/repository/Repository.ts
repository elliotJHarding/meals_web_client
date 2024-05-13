import axios, {AxiosResponse} from "axios";

export default class Repository {
    protected url : string;

    constructor(url: string) {
         this.url = url;
    }

    getHeaders() {
        return {}
    }

    get(path : string, onSuccess : (response : AxiosResponse) => void) : void {
        axios
            .get(
                this.url + path,
                {
                    headers: this.getHeaders()
                }
            )
            .then(onSuccess)
            .catch(error => console.error(error));
    }

    post(path : string, data : any, onSuccess : (response : AxiosResponse) => void) : void {
        axios
            .post(
                this.url + path,
                data,
                {
                    headers: this.getHeaders()
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
                    headers: this.getHeaders()
                }
            )
            .then(onSuccess)
            .catch(error => console.error(error));
    }

}