// src/models/payment.model.ts
import mongoose, { Schema } from "mongoose";

export interface IPayment {
  userId: mongoose.Types.ObjectId;
  planId?: mongoose.Types.ObjectId | null;
  amount: number; 
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: "created" | "paid" | "failed" | "refunded";
  meta?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan" },
    amount: { type: Number, required: true }, 
    currency: { type: String, default: "INR" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
