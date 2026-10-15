import mongoose, { Schema, Model } from "mongoose";

export interface IAnalysis {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId | string;
  resumename?: string;
  jdname?: string;
  jobDescription?: string;
  jdId?: mongoose.Types.ObjectId | string | null;
  analysis: {
    fitScore: number;
    scoreExplanation: string;
    summary: string;
    matchingSkills: string[];
    missingSkills: string[];
    strengths: string[];
    weaknesses: string[];
    suggestedImprovements: { section: string; suggestion: string }[];
    keywordGaps: string[];
  };
  fitScore: number;
  model: string;
  createdAt: Date;
  updatedAt?: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeId: {
      type: Schema.Types.Mixed,
      required: true,
    },
    resumename: {
      type: String,
      default: "",
    },
    jdname: {
      type: String,
      default: "",
    },
    jobDescription: {
      type: String,
      default: "",
    },
    jdId: {
      type: Schema.Types.Mixed,
      default: null,
    },
    analysis: {
      type: Schema.Types.Mixed,
      required: true,
    },
    fitScore: {
      type: Number,
      required: true,
    },
    model: {
      type: String,
      default: "ai/gemma3:1b-q4_K_M",
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

const Analysis: Model<IAnalysis> =
  mongoose.models.Analysis ||
  mongoose.model<IAnalysis>("Analysis", AnalysisSchema);

export default Analysis;
