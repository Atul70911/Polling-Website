import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
  Poll,
  SingleChoicePoll,
  ImageBasedPoll,
  YesNoPoll,
  RatingPoll
} from "../models/polls.models.js";

const allowedTypes = new Set(["SingleChoice", "ImageBased", "YesNo", "Rating"]);

export const createPoll = asyncHandler(async (req, res) => {
  const { type, question, options } = req.body;

  if (!type || !allowedTypes.has(type)) throw new ApiError(400, "Invalid poll type");
  if (!question?.trim()) throw new ApiError(400, "Question is required");

  const creator = req.user?._id;
  if (!creator) throw new ApiError(401, "Unauthorized");

  let poll;

  if (type === "SingleChoice") {
    if (!Array.isArray(options) || options.length < 2) {
      throw new ApiError(400, "At least 2 options required");
    }
    poll = await SingleChoicePoll.create({
      type,
      question,
      creator,
      options: options.map((t) => ({ optionText: String(t) }))
    });
  }

  if (type === "ImageBased") {
    if (!Array.isArray(options) || options.length < 2) {
      throw new ApiError(400, "At least 2 options required");
    }
    // expects options: ["https://...", ...] or if you used schema fix: [{url:"..."}, ...]
    poll = await ImageBasedPoll.create({
      type,
      question,
      creator,
      options: options.map((u) => ({ url: String(u) })) // requires schema fix above
    });
  }

  if (type === "YesNo") {
    poll = await YesNoPoll.create({ type, question, creator });
  }

  if (type === "Rating") {
    poll = await RatingPoll.create({ type, question, creator });
  }

  return res.status(201).json(new ApiResponse(201, poll, "Poll created"));
});

export const getPollById = asyncHandler(async (req, res) => {
  const { pollId } = req.params;

  const poll = await Poll.findById(pollId)
    .populate("creator", "name username profilePicture")
    .lean();

  if (!poll) throw new ApiError(404, "Poll not found");

  return res.status(200).json(new ApiResponse(200, poll, "Poll fetched"));
});

export const getPollFeed = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);

  const filter = { closed: false };
  if (req.query.type && allowedTypes.has(req.query.type)) filter.type = req.query.type;

  const polls = await Poll.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("creator", "name username profilePicture")
    .lean();

  return res.status(200).json(new ApiResponse(200, { page, limit, polls }, "Feed"));
});

export const getMyPolls = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const polls = await Poll.find({ creator: userId })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, polls, "My polls"));
});

export const closePoll = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { pollId } = req.params;

  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, "Poll not found");

  if (String(poll.creator) !== String(userId)) {
    throw new ApiError(403, "Only creator can close the poll");
  }

  poll.closed = true;
  await poll.save();

  return res.status(200).json(new ApiResponse(200, poll, "Poll closed"));
});

export const deletePoll = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { pollId } = req.params;

  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, "Poll not found");

  if (String(poll.creator) !== String(userId)) {
    throw new ApiError(403, "Only creator can delete the poll");
  }

  await Poll.deleteOne({ _id: pollId });
  return res.status(200).json(new ApiResponse(200, {}, "Poll deleted"));
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { pollId } = req.params;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const poll = await Poll.findById(pollId);
  if (!poll) throw new ApiError(404, "Poll not found");

  const already = poll.bookmarkedBy.some((id) => String(id) === String(userId));

  const updated = await Poll.findByIdAndUpdate(
    pollId,
    already ? { $pull: { bookmarkedBy: userId } } : { $addToSet: { bookmarkedBy: userId } },
    { new: true }
  ).lean();

  return res
    .status(200)
    .json(new ApiResponse(200, { bookmarked: !already, poll: updated }, "Bookmark updated"));
});


export const voteOnPoll = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { pollId } = req.params;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const poll = await Poll.findById(pollId).lean();
  if (!poll) throw new ApiError(404, "Poll not found");

  if (poll.closed) throw new ApiError(400, "Poll is closed");

  // Double vote check (fast fail)
  if (poll.voters?.some((v) => String(v) === String(userId))) {
    throw new ApiError(409, "You already voted");
  }

  let updated;

  if (poll.type === "SingleChoice") {
    const { optionIndex } = req.body;
    const idx = Number(optionIndex);

    if (!Number.isInteger(idx)) throw new ApiError(400, "optionIndex is required");
    if (!Array.isArray(poll.options) || idx < 0 || idx >= poll.options.length) {
      throw new ApiError(400, "Invalid optionIndex");
    }

    updated = await SingleChoicePoll.findOneAndUpdate(
      { _id: pollId, closed: false, voters: { $ne: userId } },
      { $addToSet: { voters: userId }, $inc: { [`options.${idx}.votes`]: 1 } },
      { new: true }
    ).lean();
  }

  if (poll.type === "ImageBased") {
    const { optionIndex } = req.body;
    const idx = Number(optionIndex);

    if (!Number.isInteger(idx)) throw new ApiError(400, "optionIndex is required");
    if (!Array.isArray(poll.options) || idx < 0 || idx >= poll.options.length) {
      throw new ApiError(400, "Invalid optionIndex");
    }

    // ✅ base Poll model — ImageBasedPoll discriminator won't find doc with SingleChoicePoll
    updated = await Poll.findOneAndUpdate(
      { _id: pollId, closed: false, voters: { $ne: userId } },
      { $addToSet: { voters: userId }, $inc: { [`options.${idx}.votes`]: 1 } },
      { new: true }
    ).lean();
  }

  if (poll.type === "YesNo") {
    const { vote } = req.body; // "yes" | "no"
    if (vote !== "yes" && vote !== "no") throw new ApiError(400, "vote must be yes or no");

    updated = await YesNoPoll.findOneAndUpdate(
      { _id: pollId, closed: false, voters: { $ne: userId } },
      { $addToSet: { voters: userId }, $inc: { [vote]: 1 } },
      { new: true }
    ).lean();
  }

  if (poll.type === "Rating") {
    const { rating } = req.body; // 1..5
    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) throw new ApiError(400, "rating must be 1 to 5");

    updated = await RatingPoll.findOneAndUpdate(
      { _id: pollId, closed: false, voters: { $ne: userId } },
      { $addToSet: { voters: userId }, $inc: { ratingSum: r, ratingCount: 1 } },
      { new: true }
    ).lean();
  }

  if (!updated) throw new ApiError(409, "Vote not applied (maybe already voted)");

  return res.status(200).json(new ApiResponse(200, updated, "Vote recorded"));
});

export const getBookmarkedPolls = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const polls = await Poll.find({ bookmarkedBy: userId })
    .sort({ createdAt: -1 })
    .populate("creator", "name username profilePicture")
    .lean();

  return res.status(200).json(new ApiResponse(200, polls, "Bookmarked polls"));
});

export const getVotedPolls = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");
  const polls = await Poll.find({ voters: userId })
    .sort({ createdAt: -1 })
    .populate("creator", "name username profilePicture")
    .lean();

  return res.status(200).json(new ApiResponse(200, polls, "Voted polls"));

})

export const getCreatedPolls = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized");
  const polls = await Poll.find({ creator: userId })
    .sort({ createdAt: -1 })
    .populate("creator", "name username profilePicture")
    .lean();

  return res.status(200).json(new ApiResponse(200, polls, "Created polls"));
})