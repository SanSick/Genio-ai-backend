const mongoose = require("mongoose");
// sanjeevsinghverma91_db_user
// Cb1ITFsk9lDb9EDF
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      tls: true,
      family: 4,
    });
    console.log(`Mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
