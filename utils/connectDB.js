const mongoose = require("mongoose");
// sanjeevsinghverma91_db_user
// Cb1ITFsk9lDb9EDF
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://sanjeevsinghverma91_db_user:Cb1ITFsk9lDb9EDF@genio-ai.yqq1shm.mongodb.net/genio-ai?retryWrites=true&w=majority&appName=Genio-ai"
    );
    console.log(`Mongodb connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
