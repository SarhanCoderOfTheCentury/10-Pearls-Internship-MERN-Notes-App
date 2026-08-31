import app from "../src/app.js";
import connectDB from "../src/config/database.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error in Vercel handler:", error);
  }
  return app(req, res);
}
