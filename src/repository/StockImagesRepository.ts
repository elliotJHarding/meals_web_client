import Repository from "./Repository.ts";

export interface PexelsPhoto {
    id: number,
    width: number,
    height: number,
    url: string,
    photographer: string,
    photographer_url: string,
    src: {
        original: string,
        large2x?: string,
        large: string,
        medium: string,
        small: string,
        portrait: string,
        landscape: string,
        tiny: string,
    }
}

export interface PexelsSearchResponse {
    total_results: number,
    page: number,
    per_page: number,
    photos: PexelsPhoto[]
}


export default class StockImagesRepository extends Repository {

    perPage: number = 16;
    orientation: string = 'landscape'
    key : string;

    override getHeaders() {
        return {Authorization: `${this.key}`}
    }

    constructor(key: string) {
        super("https://api.pexels.com/v1");
        this.key = key;
    }

    searchImages(searchTerm: string, page: number, onSuccess: (response: PexelsSearchResponse) => void) {
        console.info("Fetching images for query: ", searchTerm);
        this.get(
            `/search?query=${searchTerm}&per_page=${this.perPage}&orientation=${this.orientation}&page=${page}`,
            (response) => {
                console.info(`Successfully fetched images:`);
                console.info(response.data);
                onSuccess(response.data);
            })
    }
}