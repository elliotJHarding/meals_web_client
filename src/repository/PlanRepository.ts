import {AxiosResponse} from "axios";
import ResourceRepository from "./ResourceRepository.ts";
import Plan from "../domain/Plan.ts";

export default class PlanRepository extends ResourceRepository {

    getPlans(start : Date, end : Date, onSuccess : (plans : Plan[]) => void, onFailure : () => void) : void {
        console.info("Fetching plans")

        console.info(start.toLocaleDateString('en-gb', {day: '2-digit'}))

        const formatDate = (date : Date) : string =>
            `${date.getUTCFullYear()}-${date.toLocaleDateString('en-gb', {month: '2-digit'})}-${date.toLocaleDateString('en-gb', {day: '2-digit'})}`

        this.get(
            `plans/${formatDate(start)}/${formatDate(end)}`,
            (response : AxiosResponse) => {
                response.data.forEach((plan : Plan) => {
                    plan.date = new Date(plan.date);
                })
                onSuccess(response.data);
            },
            // @ts-ignore
            (response : AxiosResponse) => {
                onFailure();
            }
        )
    }

    createPlan(plan: Plan, onSuccess : (returnedPlan: Plan) => void) : void {
        console.info('Creating plan with values:');
        console.info(plan)

        this.post(`plans`, plan, (response: AxiosResponse) => {
            response.data.date = new Date(response.data.date)
            onSuccess(response.data)
        });
    }

    updatePlan(plan: Plan, onSuccess : () => void) : void {
        console.info('Updating plan with values:');
        console.info(plan)

        this.update(`plans/${plan.id}`, plan,() => onSuccess());
    }
}
