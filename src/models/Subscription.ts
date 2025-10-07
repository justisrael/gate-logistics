import { model, Schema } from "mongoose";

export interface SubscriptionDoc {
    name: string;
    price: number;
    description: string;
    status: string;
    type: string;
}

const subscriptionSchema = new Schema<SubscriptionDoc>({
    name: { type: String, required: true, enum: ["free", "sme", "growth"] },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    type: { type: String, enum: ["monthly", "yearly"], default: "monthly" }
}, {
    timestamps: true
})

const SubscriptionModel = model<SubscriptionDoc>("Subscription", subscriptionSchema);
export default SubscriptionModel; 