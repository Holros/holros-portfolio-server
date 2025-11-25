import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler";
import adminRouter from "./routes/adminRouter";
import userRouter from "./routes/userRouter";
import { errorResponse } from "./utils/serverResponse";
import authRouter from "./routes/authRouter";
import loginRequired from "./middlewares/loginRequired";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

const app = express();
dotenv.config();
const port = process.env.PORT || 3001;

// FIX: allow Express to read X-Forwarded-For header
app.set("trust proxy", 1);
app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());
//Limit spams
app.use(limiter);

// Importing routes
app.use("/api/auth", authRouter);
app.use("/api/admin", loginRequired, adminRouter);
app.use("/api/user", userRouter);

// Health check endpoint
app.get("/", async (_, res) => {
  res.send("OK!");
});

app.all("*any", (req, res) => {
  errorResponse(
    res,
    `Cannot ${req.method} ${req.originalUrl} on this server, please check the URL or method.`,
    null,
    404
  );
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`app is running in port ${port}`);
});
