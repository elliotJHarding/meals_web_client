import Repository from "./Repository.ts";

export type MetaData = {
    url? : string,
    title? : string,
    description? : string,
    image? : string,
    site_name? : string,
}

export default class MetaDataRepository extends Repository {

    public getMetadata(url : string, onSuccess : (metadata : MetaData) => void) : void {
        console.info(`Fetching meta data for url: ${url}`)
        this.post('metadata', {url : url}, (response) => {
            onSuccess(response.data);
            console.info('Successfully fetched metadata');
            console.info(response.data);
        });
    }

}