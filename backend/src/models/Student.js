import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  zip: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
});

const studentSchema = new mongoose.Schema(
  {
    profilePicture: {
      url: { type: String },
      public_id: { type: String },
    },
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please fill a valid E.164 phone number"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "non-binary", "prefer-not-to-say"],
      },
    },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value < new Date();
        },
        message: "Date of birth cannot be in the future.",
      },
    },
    course: {
      type: String,
      required: [true, "Course should be given"],
      enum: {
        values: ["CSE", "CSE-AI&ML", "ME", "EE", "ECE"],
      },
    },
    address: {
      type: addressSchema,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  {
    timestamps: true,
  },
);

export const Student = mongoose.model("Student", studentSchema);
