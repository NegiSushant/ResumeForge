import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobDescription extends Document {
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const JobDescriptionSchema = new Schema<IJobDescription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const JobDescription: Model<IJobDescription> =
  mongoose.models.JobDescription ||
  mongoose.model<IJobDescription>("JobDescription", JobDescriptionSchema);

export default JobDescription;
