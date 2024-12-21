import {AxiosResponse} from "axios";
import ResourceRepository from "./ResourceRepository.ts";
import Plan from "../domain/Plan.ts";

const formatDate = (date : Date) : string =>
    `${date.getUTCFullYear()}-${date.toLocaleDateString('en-gb', {month: '2-digit'})}-${date.toLocaleDateString('en-gb', {day: '2-digit'})}`

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
        console.group('Creating plan with values:');
        console.info(plan)
        console.groupEnd()

        this.post(`plans`, plan, (response: AxiosResponse) => {
            response.data.date = new Date(response.data.date)
            onSuccess(response.data)
        });
    }

    updatePlan(plan: Plan, onSuccess : () => void) : void {
        console.group('Updating plan with values:');
        console.info(plan)
        console.groupEnd()

        this.update(`plans/${plan.id}`, plan,() => {onSuccess()});
    }

    updatePlans(plans: Plan[], onSuccess : () => void) : void {
        console.group('Updating plans with values:');
        console.info(plans)
        console.groupEnd()

        this.post(`plans/shoppingList`, plans, () => onSuccess())
    }

    deletePlan(plan: Plan, onSuccess : () => void) : void {
        console.info('Deleting plans on date:');
        console.info(plan.date)

        this.delete(`plans/${formatDate(plan.date)}`, () => onSuccess());
    }

}
