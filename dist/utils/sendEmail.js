"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const env_1 = __importDefault(require("../core/env"));
const mail_config_1 = __importDefault(require("./mail.config"));
const sendEmail = async ({ to, subject, html, text }) => {
    await mail_config_1.default.sendMail({
        from: `"${env_1.default.MAIL_FROM_NAME}" <${env_1.default.MAIL_USER}>`,
        to,
        subject,
        html,
        text,
    });
};
exports.sendEmail = sendEmail;
