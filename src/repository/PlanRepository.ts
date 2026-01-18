import {PlansApi, PlanDto, Configuration} from "@elliotJHarding/meals-api";
import {toastService} from "../contexts/ToastContext.tsx";
import axios from "axios";
import {axiosInstance} from "./Client.ts";

const formatDate = (date: Date): string =>
    `${date.getUTCFullYear()}-${date.toLocaleDateString('en-gb', {month: '2-digit'})}-${date.toLocaleDateString('en-gb', {day: '2-digit'})}`;

export default class PlanRepository {
    private api: PlansApi;
    private baseUrl: string;

    constructor() {
        const configuration = new Configuration({
            basePath: import.meta.env.VITE_REPOSITORY_URL,
        });

        this.baseUrl = import.meta.env.VITE_REPOSITORY_URL;
        this.api = new PlansApi(configuration, this.baseUrl, axiosInstance);
    }

    getPlans(start: Date, end: Date, onSuccess: (plans: PlanDto[]) => void, onFailure: () => void): void {
        console.group("Fetching plans from start, end:");
        console.info(start);
        console.info(end);
        console.groupEnd();

        this.api.getPlansInRange(formatDate(start), formatDate(end))
            .then(response => {
                console.group("Successfully fetched plans");
                console.info(response.data);
                console.groupEnd();
                onSuccess(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch plans", error);
                toastService.showError('Failed to load plans');
                onFailure();
            });
    }

    createPlan(plan: PlanDto, onSuccess: (returnedPlan: PlanDto) => void): void {
        console.group('Creating plan with values:');
        console.info('Plan:', plan);
        console.groupEnd();

        this.api.createPlan(plan)
            .then(response => {
                onSuccess(response.data);
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to create plan');
            });
    }

    updatePlan(plan: PlanDto, onSuccess: () => void): void {
        console.group('Updating plan with values:');
        console.info('Plan:', plan);
        console.groupEnd();

        this.api.updatePlan(plan.id!, plan)
            .then(() => {
                onSuccess();
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to update plan');
            });
    }

    updatePlans(plans: PlanDto[], onSuccess: () => void): void {
        console.group('Updating plans with values:');
        console.info('Plans:', plans);
        console.groupEnd();

        this.api.updateShoppingList(plans)
            .then(() => {
                onSuccess();
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to update plans');
            });
    }

    deletePlan(plan: PlanDto, onSuccess: () => void): void {
        console.info('Deleting plan on date:');
        console.info(plan.date);

        if (!plan.date) {
            console.error('Plan has no date');
            toastService.showError('Cannot delete plan without date');
            return;
        }

        this.api.deletePlanByDate(plan.date)
            .then(() => {
                onSuccess();
            })
            .catch(error => {
                console.error(error);
                toastService.showError('Failed to delete plan');
            });
    }

    generateMealPlan(startDate: Date, endDate: Date, prompt: string, onSuccess: (plans: PlanDto[]) => void, onFailure: () => void): void {
        console.group("Generating AI meal plan from start, end, prompt:");
        console.info(startDate);
        console.info(endDate);
        console.info(prompt);
        console.groupEnd();

        const request = {
            weekStartDate: formatDate(startDate),
            weekEndDate: formatDate(endDate),
            prompt: prompt
        };

        // Custom axios call with error handling for AI generation
        axios
            .post(
                this.baseUrl + 'plans/generate',
                request,
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                console.group("Successfully generated meal plans");
                console.info(response.data);
                console.groupEnd();
                onSuccess(response.data);
            })
            .catch((error) => {
                console.error("Failed to generate meal plans", error);
                toastService.showError('Failed to generate meal plans');
                onFailure();
            });
    }
}
