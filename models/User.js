const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    trialPeriod:{
      type: Number, 
      default:14, //14 days free trail
    },
    trialActive: {
      type: Boolean,
      default: true,
    },
    trialExpires: {
      type: Date,
    },
    subscriptionPlan: {
      type: String,
      enum: ["Trial", "Free", "Basic", "Premium"],
      default: "Trial",
    },
    apiRequestCount: {
      type: Number,
      default: 0,
    },
    monthlyRequestCount: {
      type: Number,
      default: 100, //100 credit to the user and the user need to use this in 14 days
    },
    nextBillingDate: Date,
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    contentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContentHistory",
      },
    ],
  },
  {
    timestamps: true,
    toJSON:{virtuals: true},
    toObject:{virtuals: true},
  }
);

// //Add Virual property to the user
// userSchema.virtual("isTrialActive").get(function(){
//   return this.trialActive && new Date() < this.trialExpires
// });


//! Compile to form the model
const User = mongoose.model("User", userSchema);
module.exports = User;
