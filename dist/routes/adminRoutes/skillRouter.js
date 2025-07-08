"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../../utils/db");
const skillSchema_1 = require("../../schemas/skillSchema");
const serverResponse_1 = require("../../utils/serverResponse");
const validate_1 = require("../../middlewares/validate");
const skillRouter = express_1.default.Router();
skillRouter.post("/create", (0, validate_1.validate)(skillSchema_1.skillSchema), async (req, res) => {
    const { shortName, fullName } = req.body;
    const existingSkill = await db_1.prisma.skill.findUnique({
        where: { shortName: shortName },
    });
    if (existingSkill) {
        return (0, serverResponse_1.errorResponse)(res, "Skill already exists", null, 400);
    }
    const createdSkill = await db_1.prisma.skill.create({
        data: { shortName, fullName },
    });
    (0, serverResponse_1.successResponse)(res, "Skill created successfully", createdSkill, 201);
});
skillRouter.patch("/update/:shortName", (0, validate_1.validate)(skillSchema_1.skillSchema.partial()), async (req, res) => {
    const dataToUpdate = req.body;
    const { shortName } = req.params;
    const isSkill = await db_1.prisma.skill.findUnique({
        where: { shortName: shortName },
    });
    if (!isSkill) {
        return (0, serverResponse_1.errorResponse)(res, "Skill does not exist", null, 404);
    }
    if (dataToUpdate.shortName && dataToUpdate.shortName !== shortName) {
        const conflictingSkill = await db_1.prisma.skill.findUnique({
            where: { shortName: dataToUpdate.shortName },
        });
        if (conflictingSkill) {
            return (0, serverResponse_1.errorResponse)(res, "Short name already exists", null, 400);
        }
    }
    const updatedSkill = await db_1.prisma.skill.update({
        where: { shortName: shortName },
        data: dataToUpdate,
    });
    (0, serverResponse_1.successResponse)(res, "Skill updated successfully", updatedSkill, 200);
});
exports.default = skillRouter;
//# sourceMappingURL=skillRouter.js.map