import StockImagesRepository, {ImageSearchResponse} from "../repository/StockImagesRepository.ts";

export const useStockImages = () : {getStockPhotos: (query: string, onSuccess: (response: ImageSearchResponse) => void) => void} => {

    const repository = new StockImagesRepository();

    const getStockPhotos = (query: string, onSuccess: (response: ImageSearchResponse) => void) => {
        query.length > 0 && repository.searchImages(query, onSuccess);
    }

    return {getStockPhotos} ;
}