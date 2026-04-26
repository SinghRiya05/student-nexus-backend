"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenModel = void 0;
const mongoose_1 = require("mongoose");
const refreshTokenSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdByIp: {
        type: String,
        required: true,
    },
    revokedAt: {
        type: Date,
    },
    revokedByIp: {
        type: String,
    },
    replacedByToken: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
refreshTokenSchema.virtual("isExpired").get(function () {
    return Date.now() >= this.expiresAt.getTime();
});
refreshTokenSchema.virtual("isActive").get(function () {
    return !this.revokedAt && !this.isExpired;
});
exports.refreshTokenModel = (0, mongoose_1.model)("RefreshToken", refreshTokenSchema);
