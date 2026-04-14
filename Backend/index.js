import dotenv from "dotenv";
dotenv.config();
 
import {app} from "./app.js";
import connectDB from "./src/Database/main.js";
 
const PORT = process.env.PORT || 5000;
 
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
 