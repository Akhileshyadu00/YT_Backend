import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

// Define user schema
const userSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Never return in queries
      validate: {
        validator: function (value) {
          // At least 8 characters, one uppercase, one lowercase, one number, one special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          );
        },
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      },
    },
    about: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    profilePic: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = 12; // More secure than default (10)
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare method for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
