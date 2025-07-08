"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPaginationObject;
function getPaginationObject(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / 10);
    return {
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: currentPage,
        pageSize: 10,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
    };
}
//# sourceMappingURL=getPaginationObject.js.map