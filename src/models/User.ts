import { Schema, model, models } from 'mongoose'
const { ObjectId } = Schema

// Define the schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Email is required'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is invalid'],
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxLength: [50, 'Your name cannot exceed 50 characters'],
    },
    divisions: [
      {
        name: { type: String },
        roles: { type: Array, default: [] },
      },
      { default: [] },
    ],
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpires: {
      type: Date,
    },
    varificationToken: {
      type: String,
    },
    varificationTokenExpires: {
      type: Date,
    },
    canUpload: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)
// Define the  model
const User = models?.User || model('User', userSchema)

export default User
