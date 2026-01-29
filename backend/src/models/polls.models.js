import mongoose from "mongoose";

/**
 * Poll models (discriminators)
 * Types: SingleChoice, ImageBased, YesNo, Rating
 * Stored in one collection: `polls` using discriminatorKey `type`. [web:646]
 */

const baseOptions = {
  discriminatorKey: "type",
  collection: "polls",
  timestamps: true
};

// SingleChoice option subdocument
const textOptionSchema = new mongoose.Schema(
  {
    optionText: { type: String, required: true },
    votes: { type: Number, default: 0 }
  },
  { _id: false }
);

// Base poll schema (shared fields)
const PollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    closed: { type: Boolean, default: false }
  },
  baseOptions
);

/**
 * Indexes (add only what you query often). MongoDB has default _id index. [web:763]
 * - Feed (newest first)
 * - My polls (creator + newest first)
 */
PollSchema.index({ createdAt: -1 });
PollSchema.index({ creator: 1, createdAt: -1 });
// Optional (enable only if you build these pages)
// PollSchema.index({ bookmarkedBy: 1, createdAt: -1 });
// PollSchema.index({ type: 1, createdAt: -1 });

export const Poll = mongoose.model("Poll", PollSchema);

// 1) SingleChoice: options are [{ optionText, votes }]
export const SingleChoicePoll = Poll.discriminator(
  "SingleChoice",
  new mongoose.Schema({
    options: {
      type: [textOptionSchema],
      required: true,
      validate: [(v) => Array.isArray(v) && v.length >= 2, "At least 2 options required"]
    }
  })
);

// 2) ImageBased: options are ["https://...", "https://..."] (strings)
export const ImageBasedPoll = Poll.discriminator(
  "ImageBased",
  new mongoose.Schema({
    options: {
      type: [String],
      required: true,
      validate: [(v) => Array.isArray(v) && v.length >= 2, "At least 2 images required"]
      // Optional URL validation
      // validate: [(v) => v.every((u) => /^https?:\/\/.+/i.test(u)), "Each option must be a valid URL"]
    }
  })
);

// 3) YesNo: store counters
export const YesNoPoll = Poll.discriminator(
  "YesNo",
  new mongoose.Schema({
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 }
  })
);

// 4) Rating: store sum/count
export const RatingPoll = Poll.discriminator(
  "Rating",
  new mongoose.Schema({
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  })
);
