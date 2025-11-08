import axios, {AxiosResponse} from "axios";
import ResourceRepository from "./ResourceRepository.ts";
import Plan from "../domain/Plan.ts";

interface BackendPlanMeal {
    id?: number;
    meal: {
        id: bigint;
    };
    requiredServings: number;
    leftovers: boolean;
    note?: string;
}

interface BackendPlan {
    id?: number;
    date: Date;
    planMeals: BackendPlanMeal[];
    shoppingListItems: any[];
    note?: string;
}

const formatDate = (date : Date) : string =>
    `${date.getUTCFullYear()}-${date.toLocaleDateString('en-gb', {month: '2-digit'})}-${date.toLocaleDateString('en-gb', {day: '2-digit'})}`

const transformPlanForBackend = (plan: Plan): BackendPlan => {
    return {
        id: plan.id,
        date: plan.date,
        planMeals: plan.planMeals.map(planMeal => ({
            id: planMeal.id,
            meal: {
                id: planMeal.meal.id!
            },
            requiredServings: planMeal.requiredServings,
            leftovers: planMeal.leftovers,
            note: planMeal.note
        })),
        shoppingListItems: plan.shoppingListItems,
        note: plan.note
    };
};

export default class PlanRepository extends ResourceRepository {

    getPlans(start : Date, end : Date, onSuccess : (plans : Plan[]) => void, onFailure : () => void) : void {
        console.group("Fetching plans from start, end:")
        console.info(start)
        console.info(end)
        console.groupEnd()

        // console.info(start.toLocaleDateString('en-gb', {day: '2-digit'}))


        this.get(
            `plans/${formatDate(start)}/${formatDate(end)}`,
            (response : AxiosResponse) => {
                response.data.forEach((plan : Plan) => {
                    plan.date = new Date(plan.date);
                })
                console.group("Successfully fetched plans")
                console.info(response.data)
                console.groupEnd()
                onSuccess(response.data);
            },
            // @ts-ignore
            (response : AxiosResponse) => {
                console.error("Failed to fetch plans")
                onFailure();
            }
        )
    }

    createPlan(plan: Plan, onSuccess : (returnedPlan: Plan) => void) : void {
        const backendPlan = transformPlanForBackend(plan);
        
        console.group('Creating plan with values:');
        console.info('Original plan:', plan);
        console.info('Backend plan (with meal IDs only):', backendPlan);
        console.groupEnd()

        this.post(`plans`, backendPlan, (response: AxiosResponse) => {
            response.data.date = new Date(response.data.date)
            onSuccess(response.data)
        });
    }

    updatePlan(plan: Plan, onSuccess : () => void) : void {
        const backendPlan = transformPlanForBackend(plan);
        
        console.group('Updating plan with values:');
        console.info('Original plan:', plan);
        console.info('Backend plan (with meal IDs only):', backendPlan);
        console.groupEnd()

        this.update(`plans/${plan.id}`, backendPlan, () => {onSuccess()});
    }

    updatePlans(plans: Plan[], onSuccess : () => void) : void {
        const backendPlans = plans.map(transformPlanForBackend);
        
        console.group('Updating plans with values:');
        console.info('Original plans:', plans);
        console.info('Backend plans (with meal IDs only):', backendPlans);
        console.groupEnd()

        this.post(`plans/shoppingList`, backendPlans, () => onSuccess())
    }

    deletePlan(plan: Plan, onSuccess : () => void) : void {
        console.info('Deleting plans on date:');
        console.info(plan.date)

        this.delete(`plans/${formatDate(plan.date)}`, () => onSuccess());
    }

    generateMealPlan(startDate: Date, endDate: Date, prompt: string, onSuccess: (plans: Plan[]) => void, onFailure: () => void): void {
        console.group("Generating AI meal plan from start, end, prompt:");
        console.info(startDate);
        console.info(endDate);
        console.info(prompt);
        console.groupEnd();

        const request = {
            weekStartDate: startDate,
            weekEndDate: endDate,
            prompt: prompt
        };

        // Custom axios call with error handling for AI generation
        axios
            .post(
                this.url + 'plans/generate',
                request,
                {
                    headers: this.getHeaders(),
                    withCredentials: true,
                }
            )
            .then((response: AxiosResponse) => {
                response.data.forEach((plan: Plan) => {
                    plan.date = new Date(plan.date);
                });
                console.group("Successfully generated meal plans");
                console.info(response.data);
                console.groupEnd();
                onSuccess(response.data);
            })
            .catch((error) => {
                console.error("Failed to generate meal plans", error);
                onFailure();
            });
    }

}
