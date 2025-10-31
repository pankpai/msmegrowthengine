import { asyncHandler } from "../../shared/asyncFunchandler";
import { Request, response, Response } from "express";
import { ApiResponse } from "../../shared/Apiresponse";
import { SubscriptionPlan, UserSubscription } from "../model/plan.model";
import { razorpay } from "../dbConfig/razorPayConfig";
import crypto from "crypto";
import { Payment } from "../model/payment.model";
import User from "../model/user.model";
import { Credit } from "../model/credit.model";
import mongoose from "mongoose";
interface Ioption {
  amount: number;
  currency: string;
  receipt: string;
}

export const manageCredit = async (data: any) => {
  const { credit, date, userId, serviceKey } = data;
  try {
    const res = await Credit.create({
      credit,
      date,
      userId,
      serviceKey,
    });
  } catch (error) {
    console.log("ERROR:", error);
  }
};
//--------------------------------------------Plan Controller-------------------------------------------------------------

export const handleAddPlanofServices = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      serviceName,
      planName,
      priceCents,
      creditsTotal,
      durationDays,
      feature,
    } = req.body;
    await SubscriptionPlan.create({
      serviceKey: serviceName?.toLowerCase()?.trim(),
      serviceName,
      planName,
      priceCents,
      creditsTotal,
      durationDays,
      feature,
    });
    res.status(201).json(new ApiResponse(true, "Plan Created successfully"));
  },
);

export const handleGetPlanofServices = asyncHandler(
  async (req: Request, res: Response) => {
    const { serviceKey } = req.params;
    const all_Plan = await SubscriptionPlan.find({ serviceKey }).select(
      "-__v -createdAt",
    );
    res.status(200).json(new ApiResponse(true, "", all_Plan));
  },
);

// handle Subscription

export const handleCreateOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const { planId } = req.body;
    const userId = req.user.id;
    const plan = await SubscriptionPlan.findById(planId);

    if (!plan)
      return res.status(404).json(new ApiResponse(false, "Plan not found"));
    const amount = plan.priceCents * 100;
    const currency: string = "INR";
    const option: Ioption = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(option);
    await Payment.create({
      userId,
      planId,
      razorpayOrderId: order.id,
      amount: amount,
      currency: currency,
      status: "created",
    });

    res.status(200).json({ order });
  },
);

export const verifyPayment = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
      } = req.body;

      const userId = req.user.id;

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const razorpaySecretkey = process.env.RAZOR_PAY_SECRET_KEY;

      if (!razorpaySecretkey)
        return res
          .status(400)
          .json(new ApiResponse(false, "Seceret key is not find"));
      const expectedSign = crypto
        .createHmac("sha256", razorpaySecretkey)
        .update(sign)
        .digest("hex");

      if (razorpay_signature !== expectedSign) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "paid",
        },
        {
          new: true,
          upsert: false,
        },
      );

      const plan = await SubscriptionPlan.findById(planId);
      if (!plan) return res.status(404).json({ message: "Plan not found" });

      const startDate = new Date();
      // const endDate =
      //     plan.billing_cycle === "monthly"
      //         ? new Date(startDate.setMonth(startDate.getMonth() + 1))
      //         : new Date(startDate.setFullYear(startDate.getFullYear() + 1));

      const now = new Date();
      const planExpiry = new Date(
        now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
      );

      const updatedSubscription = await UserSubscription.findOne({
        userId,
        planId,
      });
      if (!updatedSubscription) {
        await UserSubscription.create({
          userId,
          planId,
          serviceKey: plan.serviceKey,
          paymentMethod: "razorpay",
          startsAt: now,
          expiresAt: planExpiry,
          creditsTotal: plan.creditsTotal,
          creditsRemaining: plan.creditsTotal,
        });
      } else {
        const extendedExpiry =
          updatedSubscription.expiresAt > now
            ? new Date(
                updatedSubscription.expiresAt.getTime() +
                  plan.durationDays * 24 * 60 * 60 * 1000,
              )
            : planExpiry;
        updatedSubscription.creditsTotal += plan.creditsTotal;
        updatedSubscription.creditsRemaining += plan.creditsTotal;
        updatedSubscription.expiresAt = extendedExpiry;
        await updatedSubscription.save();
      }

      res.json({
        success: true,
        message: "Payment verified & Subscription created",
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
);

export const handleGetSubscriptionByUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const objectUserId = new mongoose.Types.ObjectId(userId)
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in request",
      });
    }
    const subscriptionExists = await UserSubscription.exists({ userId });
    if (subscriptionExists) {
      const result = await UserSubscription.aggregate([
        { $match: { userId:objectUserId } },
        {
          $addFields: {
            remainingDays: {
              $ceil: {
                $divide: [
                  { $subtract: ["$expiresAt", new Date()] },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
            isExpired: {
              $lt: ["$expiresAt", new Date()],
            },
          },
        },
        {
          $group: {
            _id: null,
            services: {
              $push: {
                serviceKey: "$serviceKey",
                creditsTotal: "$creditsTotal",
                creditsRemaining: "$creditsRemaining",
                remainingDays: "$remainingDays",
                isExpired: "$isExpired",
                expiresAt: "$expiresAt",
                status: "$status",
                planId: "$planId",
                startsAt: "$startsAt",
              },
            },
            totalCredits: { $sum: "$creditsTotal" },
            totalRemaining: { $sum: "$creditsRemaining" },
          },
        },
        {
          $project: {
            _id: 0,
            services: 1,
            totalCredits: 1,
            totalRemaining: 1,
          },
        },
      ]);

      const user = await User.findById(userId).select("email name");
      console.log(result);
      return res.status(200).json({
        success: true,
        user,
        data: result[0] || {
          services: [],
          totalCredits: 0,
          totalRemaining: 0,
        },
      });
    }
    const user = await User.findById(userId).select(
      "email name credit createdAt trialEndAt plan",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const trialInfo = {
      services: [
        {
          serviceKey: "trial",
          creditsTotal: user.credit.totalcredit || 0,
          creditsRemaining: user.credit.remainingCredit || 0,
          remainingDays: Math.ceil(
            (new Date(user.trialEndAt).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
          expiresAt: user.trialEndAt,
          status: user.plan || "TRIAL",
        },
      ],
      totalCredits: user.credit.totalcredit || 0,
      totalRemaining: user.credit.remainingCredit || 0,
    };

    return res.status(200).json({
      success: true,
      user,
      data: trialInfo,
    });
  },
);

export const handleCreditManagement = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, email, credit, serviceKey } = req.body;
    const currentSubscription = await UserSubscription.findOne({
      userId: id,
      serviceKey,
    });
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(false, "Invalid request or user does not exist"));
    }

    if (!currentSubscription) {
      if (user.credit.remainingCredit < credit) {
        return res
          .status(400)
          .json(new ApiResponse(false, "Your credit is ended!"));
      }
      user.credit.remainingCredit -= credit;
      await user.save();
      await manageCredit({ credit, date: new Date(), userId: id, serviceKey });
      return res.status(200).json(new ApiResponse(true, "Token Deducted"));
    }

    if (currentSubscription.creditsRemaining < credit) {
      return res
        .status(400)
        .json(new ApiResponse(false, "Your subscription credit is ended!"));
    }

    currentSubscription.creditsRemaining -= credit;
    await currentSubscription.save();
    await manageCredit({ credit, date: new Date(), userId: id, serviceKey });
    return res.status(200).json(new ApiResponse(true, "Token Deducted"));
  },
);

export const getCreditUsesperMonth = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const creditByDate = await Credit.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$date",
            },
          },
          totalcredit: {
            $sum: "$credit",
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    return res.status(200).json(new ApiResponse(true, "", creditByDate));
  },
);

// ✅ NEW FUNCTION: Get credit summary (per-service + total)
export const getCreditSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;

    // Get per-service usage
    const perServiceUsage = await Credit.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$serviceKey",
          totalUsed: { $sum: "$credit" },
        },
      },
    ]);

    // Get active subscriptions
    // const subscriptions = await UserSubscription.find({ userId });
    // const totalCreditsAvailable = subscriptions.reduce(
    //   (sum, s) => sum + (s.creditsRemaining || 0),
    //   0,
    // );
    // const totalCreditsUsed = perServiceUsage.reduce(
    //   (sum, s) => sum + s.totalUsed,
    //   0,
    // );

    res.status(200).json(
      new ApiResponse(true, "Credit summary", {
        perServiceUsage,
        // totalCreditsAvailable,
        // totalCreditsUsed,
      }),
    );
  },
);
