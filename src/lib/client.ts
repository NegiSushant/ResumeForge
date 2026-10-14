import OpenAI from "openai";

export const dmr = new OpenAI({
  baseURL: process.env.DMR_BASE_URL || "http://localhost:12434/engines/v1",
  apiKey: "not-needed",
});

export const DMR_MODEL = process.env.DMR_MODEL || "ai/gemma3:1b-q4_K_M";
