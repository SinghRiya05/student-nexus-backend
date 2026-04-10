import { Schema, model, Types } from "mongoose";
import { IUser } from "../interfaces/masterInterfaces/user.interface";
import bcrypt from "bcrypt"


const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
    },

    coverImage: {
      type: String,
    },

    bio: {
      type: String,
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    universityId: {
      type: Types.ObjectId,
      ref: "University"
    },

    courseIds: [{
      type: Types.ObjectId,
      ref: "Course"
    }],

    semesterId: {
      type: Types.ObjectId,
      ref: "Semester"
    },

    roleId: {
      type: Types.ObjectId,
      ref: "Role"
    },

    verificationStatus: {
      type: Boolean,
      default: false
    },

    followersCount: {
      type: Number,
      default: 0
    },

    followingCount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "INACTIVE"
    },

    isPrivate: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    trustScore: {
      type: Number,
      default: 0,
    },

    startYear: {
      type: Number,
    },

    endYear: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual("studentProfile", {
  ref: "StudentProfile",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.virtual("aluminiProfile", {
  ref: "AluminiProfile",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.virtual("teacherProfile", {
  ref: "TeacherProfile",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
}

export const userModel = model<IUser>("User", userSchema);