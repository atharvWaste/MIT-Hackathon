import dotenv from 'dotenv'
dotenv.config();

import { MongoClient } from "mongodb";

const uri = process.env.DB_URL;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export default connectDB;