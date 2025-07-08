"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const serverResponse_1 = require("../utils/serverResponse");
const errorHandler = (err, _req, res, _next) => {
    console.error("Error caught by errorHandler:", err);
    if (err instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                return (0, serverResponse_1.errorResponse)(res, `Duplicate value: ${err.meta?.target} already exists.`, null, 400);
            case "P2025":
                return (0, serverResponse_1.errorResponse)(res, "Record not found.", null, 404);
            default:
                return (0, serverResponse_1.errorResponse)(res, "We couldn't process your request due to a database issue. Please try again.", null, 500);
        }
    }
    if (err instanceof prisma_1.Prisma.PrismaClientValidationError) {
        return (0, serverResponse_1.errorResponse)(res, "Validation error", err.message, 400);
    }
    if (err instanceof prisma_1.Prisma.PrismaClientInitializationError) {
        return (0, serverResponse_1.errorResponse)(res, "We are having trouble connecting to the server. Please try again later.", null, 500);
    }
    if (err.statusCode) {
        return (0, serverResponse_1.errorResponse)(res, err.message, null, err.statusCode);
    }
    else
        return (0, serverResponse_1.errorResponse)(res, "Something went wrong, please try again later", null, 500);
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map