import Plan from "./Plan.ts";

export default class MealPlan {
    plans: Plan[];

    static formatDate(date : Date) {
        return `${date.getUTCFullYear()}-${date.toLocaleDateString('en-gb', {month: '2-digit'})}-${date.toLocaleDateString('en-gb', {day: '2-digit'})}`
    }


    constructor(plans: Plan[]) {
        this.plans = plans?.sort((a, b) => a.date.getTime() - b.date.getTime()) ?? [];
    }

    isComplete() {
        return this.plans.find(plan => plan.dinner == null) == null;
    }

    isEmpty() {
        return this.plans.find(plan => plan.dinner != null) == null;
    }

    from() {
        return MealPlan.formatDate(this.plans[0].date);
    }

    to() {
        return MealPlan.formatDate(this.plans[this.plans.length - 1].date);
    }
}