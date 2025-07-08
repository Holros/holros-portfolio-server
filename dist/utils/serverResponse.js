"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (res, message = "Request was successful", data = null, statusCode = 200) => {
    res.status(statusCode).json({ success: true, message, data, errors: null });
};
exports.successResponse = successResponse;
const errorResponse = (res, message = "An error occurred", errors = null, statusCode = 400) => {
    res.status(statusCode).json({ success: false, message, data: null, errors });
};
exports.errorResponse = errorResponse;
//# sourceMappingURL=serverResponse.js.map