// const mongoose = require("mongoose");
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       serverSelectionTimeoutMS: 30000,
//       tls: true,
//       family: 4,
//     });
//     console.log(`Mongodb connected ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error connecting to MongoDB ${error.message}`);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

import mongoose from "mongoose";
const { connect, connection } = mongoose;
const connectDB = async () => {
  if (connection.readyState >= 1) {
    return;
  }
  try {
    const conn = await connect(process.env.MONGODB_URI, {
      // serverSelectionTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      tls: true,
      family: 4,
    });
    console.log(`Mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB ${error.message}`);
    process.exit(1);
    throw error;
  }
};

export default connectDB;
