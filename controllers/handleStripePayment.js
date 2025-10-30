const asyncHandler = require("express-async-handler");
const { calculateNextBillingDate } = require("../utils/calculateNextBillingDate");
const { shouldRenewSubscriptionPlan } = require("../utils/shouldRenewsubscriptionPlan");
const Payment = require("../models/Payment");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//*-------- Stripe payment -------*//
const handlestripePayment = asyncHandler(async (req, res) => {
  //   console.log("Request body:", req.body);
  const { amount, subscriptionPlan } = req.body;
  //get the user
  const user = req?.user;
//   console.log(user);
  try {
    //^ Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "usd",
      //add some data the meta object because it is important for verfication endpoint
      metadata: {
        userId: user?._id?.toString(), // this id is a object in mongodb and stripe require it to be in string
        userEmail: user?.email,
        subscriptionPlan,
      },
    });
    // console.log(paymentIntent);
    //^ Send the reponse back
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: error});
  }
});
//*--------- Verify Payment -------*//
const verifyPayment = asyncHandler(async (req, res) => {
  const {paymentId} = req.params;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
    // console.log(paymentIntent);
    if (paymentIntent.status === 'succeeded') {
      const metadata = paymentIntent?.metadata;
      const subscriptionPlan = metadata?.subscriptionPlan;
      const userEmail = metadata?.userEmail;
      const userId = metadata?.userId;

      //Find the user
      const userFound = await User.findById(userId);
      if (!userFound) {
        return res.status(404).json({
          status: "false",
          message: "User not found",
        });
      }
      //Get the payment details
      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;

      //create the payment history
      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: "success",
        reference: paymentId,
      });

      //Check for the subscription plan
      if (subscriptionPlan === "Basic") {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 500,
          subscriptionPlan:"Basic",
          $addToSet: {payments: newPayment?._id},
        })

        res.json({
          status: true,
          message: "Payment verified, user updated",
          updatedUser,
        });
      }

      if (subscriptionPlan === "Premium") {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 1000,
          subscriptionPlan:"Premium",
          $addToSet: {payments: newPayment?._id},
        })

        res.json({
          status: true,
          message: "Payment verified, user updated",
          updatedUser,
        });
      }

    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error});
  }
});

//*-------- Handle Free subscription -------*//
const handleFreeSubscription = asyncHandler(async (req, res) => {
  //Get the login user
  const user = req?.user;
  // console.log(user);
  //Check if user account should be renew or not
  try {
    if (shouldRenewSubscriptionPlan(user)) {
      //Update the user payment
      user.subscriptionPlan = 'Free';
      user.monthlyRequestCount = 200;
      user.apiRequestCount = 0;
      //Calculate the next billing date
      user.nextBillingDate = calculateNextBillingDate();;

      //Create new payment and save into DB
      const newPayment = await Payment.create({
        user: user?._id,
        subscriptionPlan: "Free",
        amount: 0,
        status: "success",
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 200,
        currency: "usd",
      });
      user.payments.push(newPayment?._id);
      //save the user 
      await user.save();
      //Send the reponse
      res.json({
        status: "success",
        message: "Subscription plan updated successfully",
        user,
      });

    }else{
      return res.status(403).json({error: 'Subscription renewal not due yet'})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error});
  }
});



module.exports = { handlestripePayment, handleFreeSubscription, verifyPayment };
