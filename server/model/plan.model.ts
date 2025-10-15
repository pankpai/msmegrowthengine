import mongoose, { Schema } from "mongoose";
interface ISubscriptionPlan extends Document {
  serviceKey: string;
  serviceName: string;
  planName: string;
  priceCents: number;
  creditsTotal: number;
  durationDays: number;
  feature: string[];
  createdAt: Date;
}

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

interface IUserSubscription extends Document {
  userId: mongoose.Types.ObjectId;
  serviceKey: string; // influencer, review
  planId: mongoose.Types.ObjectId; // ServicePlan
  creditsTotal: number;
  creditsRemaining: number;
  startsAt: Date;
  expiresAt: Date;
  status: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  serviceKey: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    required: true,
    default: "basic",
    enum: ["basic", "pro", "master"],
  },
  priceCents: {
    type: Number,
    required: true,
  },
  creditsTotal: {
    type: Number,
    required: true,
  },
  durationDays: {
    type: Number,
    required: true,
  },
  feature: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const SubscriptionPlan = mongoose.model<ISubscriptionPlan>(
  "ServicePlan",
  subscriptionPlanSchema,
);

// model for user subscription

const UserSubscriptionSchema = new Schema<IUserSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceKey: {
      type: String,
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "ServicePlan",
    },
    creditsTotal: { type: Number, required: true },
    creditsRemaining: {
      type: Number,
      required: true,
    },
    startsAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    status: { type: String, default: "ACTIVE" },
  },
  { timestamps: true },
);

export const UserSubscription = mongoose.model<IUserSubscription>(
  "UserSubscription",
  UserSubscriptionSchema,
);
