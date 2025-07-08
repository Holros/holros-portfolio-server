"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFormData = void 0;
const serverResponse_1 = require("../utils/serverResponse");
const normalizeFormData = (booleanFields = [], jsonFields = []) => {
    return (req, res, next) => {
        if (!req.body)
            return next();
        for (const field of booleanFields) {
            if (req.body[field] !== undefined) {
                req.body[field] = req.body[field] === "true";
            }
        }
        for (const field of jsonFields) {
            if (req.body[field] !== undefined) {
                try {
                    req.body[field] = JSON.parse(req.body[field]);
                }
                catch (err) {
                    return (0, serverResponse_1.errorResponse)(res, `Invalid JSON format in field '${field}'`, err, 400);
                }
            }
        }
        next();
    };
};
exports.normalizeFormData = normalizeFormData;
//# sourceMappingURL=normalizeFormData.js.map