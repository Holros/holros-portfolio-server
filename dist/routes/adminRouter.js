"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./adminRoutes/userRouter"));
const testimonialRouter_1 = __importDefault(require("./adminRoutes/testimonialRouter"));
const skillRouter_1 = __importDefault(require("./adminRoutes/skillRouter"));
const projectRouter_1 = __importDefault(require("./adminRoutes/projectRouter"));
const adminRouter = express_1.default.Router();
adminRouter.use("/user", userRouter_1.default);
adminRouter.use("/testimonial", testimonialRouter_1.default);
adminRouter.use("/skill", skillRouter_1.default);
adminRouter.use("/project", projectRouter_1.default);
exports.default = adminRouter;
//# sourceMappingURL=adminRouter.js.map