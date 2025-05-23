import { mongoose } from "../db.js";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 60,
    },
    firstName: {
      type: String,
      required: true,
      maxlength: 60,
    },
    surname: {
      type: String,
      required: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      maxlength: 10,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      province: {
        type: String,
        required: true,
      },
      town: {
        type: String,
        required: true,
      },
      streetAddress: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    emailVerified: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "user", // Assuming this references another user
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.model("User", UserSchema);
