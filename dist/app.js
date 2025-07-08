"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const serverResponse_1 = require("./utils/serverResponse");
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const loginRequired_1 = __importDefault(require("./middlewares/loginRequired"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use((0, helmet_1.default)());
app.use(limiter);
app.use("/api/auth", authRouter_1.default);
app.use("/api/admin", loginRequired_1.default, adminRouter_1.default);
app.use("/api/user", userRouter_1.default);
app.all("*any", (req, res) => {
    (0, serverResponse_1.errorResponse)(res, `Cannot ${req.method} ${req.originalUrl} on this server, please check the URL or method.`, null, 404);
});
app.use(errorHandler_1.default);
app.listen(port, () => {
    console.log(`app is running in port ${port}`);
});
{
}
//# sourceMappingURL=app.js.map