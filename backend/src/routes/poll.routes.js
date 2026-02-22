import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";

import {
  createPoll,
  getPollFeed,
  getMyPolls,
  getPollById,
  voteOnPoll,
  closePoll,
  deletePoll,
  toggleBookmark
} from "../controllers/poll.controller.js";

const router = Router();

// public
router.get("/", getPollFeed);
router.get("/:pollId", validateObjectId("pollId"), getPollById);

// auth required
router.post("/", verifyJWT, createPoll);
router.get("/me/list", verifyJWT, getMyPolls);

router.post("/:pollId/vote", verifyJWT, validateObjectId("pollId"), voteOnPoll);
router.post("/:pollId/bookmark", verifyJWT, validateObjectId("pollId"), toggleBookmark);

router.patch("/:pollId/close", verifyJWT, validateObjectId("pollId"), closePoll);
router.delete("/:pollId", verifyJWT, validateObjectId("pollId"), deletePoll);

export default router;