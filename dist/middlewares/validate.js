"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const serverResponse_1 = require("../utils/serverResponse");
const validate = (schema, source = "body") => (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        const validationErrors = result.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        return (0, serverResponse_1.errorResponse)(res, `Invalid request ${source}`, validationErrors, 400);
    }
    if (source !== "query")
        req[source] = result.data;
    else
        req.safeQuery = result.data;
    return next();
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map