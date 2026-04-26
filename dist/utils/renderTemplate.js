"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// cache object
const templateCache = {};
const renderTemplate = (templateName, data) => {
    try {
        // agar cache me already compiled template hai
        if (!templateCache[templateName]) {
            const templatePath = path_1.default.join(__dirname, "../templates", `${templateName}.hbs`);
            const templateSource = fs_1.default.readFileSync(templatePath, "utf8");
            // compile once
            templateCache[templateName] = handlebars_1.default.compile(templateSource);
        }
        // render using cached template
        return templateCache[templateName](data);
    }
    catch (error) {
        console.error("Template rendering error:", error);
        throw new Error("Failed to render email template");
    }
};
exports.renderTemplate = renderTemplate;
