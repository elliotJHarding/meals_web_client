import ResourceRepository from "./ResourceRepository.ts";

export interface ImageSearchResponse {
    imageUrls: string[]
}

export default class StockImagesRepository extends ResourceRepository {

    searchImages(searchTerm: string, onSuccess: (response: ImageSearchResponse) => void) {
        console.info("Fetching images for query: ", searchTerm);
        this.get(
            `images/search?query=${searchTerm}`,
            (response) => {
                console.info(`Successfully fetched images:`);
                console.info(response.data);
                onSuccess(response.data);
            })
    }
}