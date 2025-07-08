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

app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
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

{
  /*
  Teleport todo
2) Host and connect to frontend
 */
  /*
  Teleport todo frontend
1) Add loaders to all images
2) Connect the backend and add fallback UIs where needed
3) Create the admin login and edit access page
4) Add a filter by category to the projects
5) change the cards of the projects it needs to allow mobile apps now
6) Check for any other thing worth changing
 */
}
