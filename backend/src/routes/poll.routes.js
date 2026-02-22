import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
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

// auth required (put static paths BEFORE "/:pollId")
router.get("/me/list", VerifyJWT, getMyPolls);
router.post("/", VerifyJWT, createPoll);

router.post("/:pollId/vote", VerifyJWT, validateObjectId("pollId"), voteOnPoll);
router.post("/:pollId/bookmark", VerifyJWT, validateObjectId("pollId"), toggleBookmark);

router.patch("/:pollId/close", VerifyJWT, validateObjectId("pollId"), closePoll);
router.delete("/:pollId", VerifyJWT, validateObjectId("pollId"), deletePoll);

// public (dynamic path last)
router.get("/:pollId", validateObjectId("pollId"), getPollById);

export default router;