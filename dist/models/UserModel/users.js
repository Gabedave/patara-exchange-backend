"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let UserSchema = new mongoose_1.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password_hash: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
    },
    country: {
        type: String,
    },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });
UserSchema.index({ "$**": "text" }); // to index all string field
const usersModel = mongoose_1.model("users", UserSchema);
exports.default = usersModel;
