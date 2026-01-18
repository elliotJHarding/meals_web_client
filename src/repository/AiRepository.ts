import {MealPlanningApi, DayMealPlanChatRequest, DayMealPlanChatResponse, Configuration} from "@harding/meals-api";
import {toastService} from "../contexts/ToastContext.tsx";
import axios from "axios";

export default class AiRepository {
    private api: MealPlanningApi;

    constructor() {
        const configuration = new Configuration({
            basePath: import.meta.env.VITE_REPOSITORY_URL,
        });

        const axiosInstance = axios.create({
            withCredentials: true,
        });

        this.api = new MealPlanningApi(configuration, import.meta.env.VITE_REPOSITORY_URL, axiosInstance);
    }

    chatMealPlanSuggestions(
        request: DayMealPlanChatRequest,
        onSuccess: (response: DayMealPlanChatResponse) => void,
        onFailure?: () => void
    ): void {
        console.info("Calling AI meal plan chat endpoint");
        console.info("Request:", request);

        this.api.chatMealPlanDay(request)
            .then(response => {
                const chatResponse: DayMealPlanChatResponse = response.data;
                console.info("AI chat response:", chatResponse);
                onSuccess(chatResponse);
            })
            .catch(error => {
                console.error(error);
                // toastService.showError('Failed to get AI meal suggestions');
                if (onFailure) {
                    onFailure();
                }
            });
    }
}
