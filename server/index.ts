import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import connectDB from "./dbConfig/dbConnection";
import authRouter from "./routes/auth.route";
import PlanRouter from "./routes/plan";
import { errorHandler } from "../shared/errorhandler";
export function createServer() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: ["http://localhost:8080", "http://localhost:8081"],
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  connectDB();

  app.use("/api/v1", authRouter);
  app.use("/api/v1/plan", PlanRouter);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.use(errorHandler);
  return app;
}
