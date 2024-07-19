import Plan from "./Plan.ts";

export default class MealPlan {
    plans: Plan[];

    constructor(plans: Plan[]) {
        this.plans = plans?.sort((a, b) => a.date.getTime() - b.date.getTime()) ?? [];
    }

    isComplete() {
        return this.plans.find(plan => plan.dinner == null) == null;
    }

    isEmpty() {
        return this.plans.find(plan => plan.dinner != null) == null;
    }
}