"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const responses_1 = require("../core/responses");
const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        (0, responses_1.sendErrorsResponse)(res, 400, error.issues);
    }
};
exports.validateRequest = validateRequest;
