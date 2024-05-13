import StockImagesRepository, {PexelsSearchResponse} from "../repository/StockImagesRepository.ts";

export const useStockImages = () : {getStockPhotos: (query: string, page: number, onSuccess: (response: PexelsSearchResponse) => void) => void} => {

    const repository = new StockImagesRepository(import.meta.env.VITE_PEXELS_API_KEY);

    const getStockPhotos = (query: string, page: number, onSuccess: (response: PexelsSearchResponse) => void) => {
        query.length > 0 && repository.searchImages(query, page, onSuccess);
    }

    return {getStockPhotos} ;
}