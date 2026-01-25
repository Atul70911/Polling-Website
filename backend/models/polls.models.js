const mongoose = require("mongoose");

const baseOptions = {
  discriminatorKey: "type",
  collection: "polls",
  timestamps: true
};

// For SingleChoice (text options)
const textOptionSchema = new mongoose.Schema(
  {
    optionText: { type: String, required: true },
    votes: { type: Number, default: 0 }
  },
  { _id: false }
);

// Base poll (common fields for every poll type)
const PollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // prevent double voting

    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // bookmarks

    closed: { type: Boolean, default: false }
  },
  baseOptions
);

const Poll = mongoose.model("Poll", PollSchema);

// 1) SingleChoice: options are [{ optionText, votes }]
const SingleChoicePoll = Poll.discriminator(
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
const ImageBasedPoll = Poll.discriminator(
  "ImageBased",
  new mongoose.Schema({
    options: {
      type: [String],
      required: true,
      validate: [
        (v) => Array.isArray(v) && v.length >= 2,
        "At least 2 images required"
      ]
      // Optional URL validation (uncomment if you want)
      // validate: [
      //   (v) => v.every((u) => /^https?:\/\/.+/i.test(u)),
      //   "Each option must be a valid URL"
      // ]
    }
  })
);

// 3) YesNo: store counters
const YesNoPoll = Poll.discriminator(
  "YesNo",
  new mongoose.Schema({
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 }
  })
);

// 4) Rating: store sum/count
const RatingPoll = Poll.discriminator(
  "Rating",
  new mongoose.Schema({
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  })
);

module.exports = {
  Poll,
  SingleChoicePoll,
  ImageBasedPoll,
  YesNoPoll,
  RatingPoll
};
