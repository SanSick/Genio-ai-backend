import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reference: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
    subscriptionPlan: {
        type: String,
        required: true,
    },
    //*-- remember this we might have to correct it --*//
    amount: {
      type: Number,
      default: 0,
    },
    monthlyRequestCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);


//! Compile to form the model
const Payment = model("Payment", paymentSchema);
export default Payment;
