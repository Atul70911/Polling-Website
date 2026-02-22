import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import pollRoutes from "./routes/poll.routes.js";

const app = express();

const corsOptions = {
  origin: "https://atul70911.github.io/Polling-Website/", // must be exact origin (no path)
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS to ALL requests
app.use(cors(corsOptions));

// ✅ Handle preflight for ALL routes
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Routes
// Choose ONE and match frontend calls:

// Option A (recommended): singular "/user"
app.use("/api/v1/user", userRouter);

// Option B: plural "/users"
// app.use("/api/v1/users", userRouter);

app.use("/api/v1/polls", pollRoutes);

export { app };