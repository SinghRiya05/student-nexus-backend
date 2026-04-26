"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    universityId: {
        type: mongoose_1.Types.ObjectId,
        ref: "University"
    },
    courseIds: [{
            type: mongoose_1.Types.ObjectId,
            ref: "Course"
        }],
    roleId: {
        type: mongoose_1.Types.ObjectId,
        ref: "Role"
    },
    verificationStatus: {
        type: Boolean,
        default: false
    },
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "INACTIVE"
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    trustScore: {
        type: Number,
        default: 0,
    },
    startYear: {
        type: Number,
    },
    endYear: {
        type: Number,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
userSchema.virtual("studentProfile", {
    ref: "StudentProfile",
    localField: "_id",
    foreignField: "userId",
    justOne: true,
});
userSchema.virtual("aluminiProfile", {
    ref: "AluminiProfile",
    localField: "_id",
    foreignField: "userId",
    justOne: true,
});
userSchema.virtual("teacherProfile", {
    ref: "TeacherProfile",
    localField: "_id",
    foreignField: "userId",
    justOne: true,
});
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    const salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
exports.userModel = (0, mongoose_1.model)("User", userSchema);
