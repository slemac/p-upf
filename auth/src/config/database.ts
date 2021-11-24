import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("database connection successful");
  } catch (err) {
    console.error(err);
  }
};

export default dbConnection;
