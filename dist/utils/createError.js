"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = createError;
function createError(message, statusCode = 400) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
}
//# sourceMappingURL=createError.js.map