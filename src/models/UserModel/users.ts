import { Schema, SchemaTypes, model } from "mongoose";

let UserSchema: Schema = new Schema(
  {
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
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

UserSchema.index({ "$**": "text" }); // to index all string field

const usersModel = model("users", UserSchema);

export default usersModel;
