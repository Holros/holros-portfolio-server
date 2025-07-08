"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
exports.refreshTokens = refreshTokens;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createError_1 = require("./createError");
const accessJwtSecret = process.env.ACCESS_JWT_SECRET || "";
const refreshJwtSecret = process.env.REFRESH_JWT_SECRET || "";
function generateTokens(user) {
    const accessToken = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, accessJwtSecret, {
        expiresIn: "15m",
    });
    const refreshToken = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, refreshJwtSecret, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
}
function refreshTokens(refreshToken) {
    try {
        const decode = jsonwebtoken_1.default.verify(refreshToken, refreshJwtSecret);
        const newAccessToken = jsonwebtoken_1.default.sign({
            email: decode.email,
            id: decode.id,
        }, accessJwtSecret, { expiresIn: "15m" });
        const newRefreshToken = jsonwebtoken_1.default.sign({
            email: decode.email,
            id: decode.id,
        }, refreshJwtSecret, { expiresIn: "7d" });
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    catch {
        throw (0, createError_1.createError)("Refresh token invalid or expired, please login again", 400);
    }
}
//# sourceMappingURL=authTokens.js.map