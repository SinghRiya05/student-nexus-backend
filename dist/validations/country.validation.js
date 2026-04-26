"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCountrySchema = exports.createCountrySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createCountrySchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string("Country name should be a string"),
        code: zod_1.default
            .string("Country code should be a string")
            .min(1, "Country code is required"),
    }),
});
exports.updateCountrySchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string("Country name should be a string").optional(),
        code: zod_1.default.string("Country code should be a string").min(1, "Country code is required").optional(),
    })
});
