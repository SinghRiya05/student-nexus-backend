"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followModel = void 0;
const mongoose_1 = require("mongoose");
const followSchema = new mongoose_1.Schema({
    follower: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    following: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED"],
        default: "PENDING",
        required: true
    }
}, { timestamps: true });
followSchema.index({ follower: 1, following: 1 }, { unique: true });
exports.followModel = (0, mongoose_1.model)("Follow", followSchema);
