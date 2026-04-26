"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("../core/env"));
const transporter = nodemailer_1.default.createTransport({
    host: env_1.default.MAIL_HOST,
    port: Number(env_1.default.MAIL_PORT),
    secure: false,
    auth: {
        user: env_1.default.MAIL_USER,
        pass: env_1.default.MAIL_PASS
    }
});
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Mail server error:", error);
    }
    else {
        console.log("✅ Mail server is ready");
    }
});
exports.default = transporter;
