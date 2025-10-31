import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: string;
  services?: ("influencer" | "review-sentiment")[];
  clientId?: string;
  credit: {
    totalcredit: number;
    remainingCredit: number;
  };
  plan: string;
  isActive: boolean;
  trialEndAt: Date;
}
// export interface IUser extends Document {
//   name: string;
//   email: string;
//   password: string;
//   role?: string;
//   clientId?: string;
//   authProvider?: string;
//   googleId?: string;
//   credit: {
//     totalcredit: number;
//     remainingCredit: number;
//   };
//   isActive:boolean
//   plan: string;
//   trialEndAt: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

const UserSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["brand", "influencer"] },
    services: {
      type: [String],
      enum: ["influencer", "review-sentiment"],
    },
    credit: {
      totalcredit: {
        type: Number,
        default: 200,
      },
      remainingCredit: {
        type: Number,
        default: 200,
      },
    },
    plan: {
      type: String,
      default: "TRIAL",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    trialEndAt: {
      type: Date,
      default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
    clientId: { type: String, unique: true, default: () => uuidv4() },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);

// const UserSchema: Schema = new Schema<IUser>(
//   {
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true },
//     role: { type: String, default: "user", enum: ["user", "admin"] },
//     credit: {
//       totalcredit: {
//         type: Number,
//         default: 200,
//       },
//       remainingCredit: {
//         type: Number,
//         default: 200,
//       },
//     },
//     plan: {
//       type: String,
//       default: "TRIAL",
//     },
//     isActive:{
//       type:Boolean,
//       default:true
//     },
//     trialEndAt: {
//       type: Date,
//       default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
//     },
//     clientId: { type: String, unique: true, default: () => uuidv4() },
//     authProvider: { type: String, enum: ["local", "google"], default: "local" },
//     googleId: { type: String },
//   },
//   { timestamps: true },
// );
