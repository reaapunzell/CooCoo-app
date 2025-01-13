import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

const dbConnect = async () => {
  try {
    if (!DB_URL) {
      throw new Error("DB URI is not defined. Please set the DB_URL environment variable.");
    }

    await mongoose.connect(DB_URL);
    console.log(`[database]: connected to db`);
  } catch (err) {
    console.warn(`[database error]: ${err.message}`);
  }
};

export { dbConnect, mongoose };
