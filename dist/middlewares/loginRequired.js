"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = loginRequired;
const serverResponse_1 = require("../utils/serverResponse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessJwtSecret = process.env.ACCESS_JWT_SECRET || "";
function loginRequired(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return (0, serverResponse_1.errorResponse)(res, "Access token required, Please login first", null, 400);
    }
    const token = authHeader.split(" ")[1];
    if (!token)
        return (0, serverResponse_1.errorResponse)(res, "Access token required, Please login first", null, 400);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, accessJwtSecret);
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return (0, serverResponse_1.errorResponse)(res, "Access token expired", null, 401);
        }
        return (0, serverResponse_1.errorResponse)(res, "Invalid access token", null, 400);
    }
}
//# sourceMappingURL=loginRequired.js.map