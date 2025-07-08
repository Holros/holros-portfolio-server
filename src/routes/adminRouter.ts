import express from "express";
import userRouter from "./adminRoutes/userRouter";
import testimonialRouter from "./adminRoutes/testimonialRouter";
import skillRouter from "./adminRoutes/skillRouter";
import projectRouter from "./adminRoutes/projectRouter";

const adminRouter = express.Router();

//Routes
adminRouter.use("/user", userRouter);
adminRouter.use("/testimonial", testimonialRouter);
adminRouter.use("/skill", skillRouter);
adminRouter.use("/project", projectRouter);

export default adminRouter;
