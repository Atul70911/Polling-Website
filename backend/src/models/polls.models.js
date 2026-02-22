import mongoose from "mongoose";

const baseOptions = {
  discriminatorKey: "type",
  collection: "polls",
  timestamps: true
};

const textOptionSchema = new mongoose.Schema(
  {
    optionText: { type: String, required: true },
    votes: { type: Number, default: 0 }
  },
  { _id: false }
);

// ✅ NEW: image option schema with votes
const imageOptionSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    votes: { type: Number, default: 0 }
  },
  { _id: false }
);

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

PollSchema.index({ createdAt: -1 });
PollSchema.index({ creator: 1, createdAt: -1 });

export const Poll = mongoose.model("Poll", PollSchema);

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

// ✅ FIXED: ImageBased options now store url + votes
export const ImageBasedPoll = Poll.discriminator(
  "ImageBased",
  new mongoose.Schema({
    options: {
      type: [imageOptionSchema],
      required: true,
      validate: [(v) => Array.isArray(v) && v.length >= 2, "At least 2 images required"]
      // Optional:
      // validate: [(v) => v.every((o) => /^https?:\/\/.+/i.test(o.url)), "Each option must be a valid URL"]
    }
  })
);

export const YesNoPoll = Poll.discriminator(
  "YesNo",
  new mongoose.Schema({
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 }
  })
);

export const RatingPoll = Poll.discriminator(
  "Rating",
  new mongoose.Schema({
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  })
);