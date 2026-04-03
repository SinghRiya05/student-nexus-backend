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
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    universityId: {
      type: Types.ObjectId,
      ref: "University",
      required: true
    },

    courseId: [{
      type: Types.ObjectId,
      ref: "Course"
    }],

    semesterId: {
      type: Types.ObjectId,
      ref: "Semester"
    },

    roleId: {
      type: Types.ObjectId,
      ref: "Role",
      required: true
    },

    verificationStatus: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE"
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save",async function () {
    if(!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

userSchema.methods.comparePassword=async function(candidatePassword:string){
    return bcrypt.compare(candidatePassword, this.password);
}

export const userModel = model<IUser>("User", userSchema);