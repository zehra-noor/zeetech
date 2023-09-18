import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB connected");
  } catch (error) {
    console.log(`Error while connecting to DB : ${error}`);
    process.exit(1);
  }
};

export default connectDB;
