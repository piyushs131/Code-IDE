import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { rateLimit } from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
import cron from "node-cron";

import { SERVER_URL } from "./config/constants";
import { validateApiKey } from "./middlewares/validateApiKey.middleware";
import codeExecuteRoute from "./routes/CodeExecute.route";
import pingRoute from "./routes/Ping.route";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: { error: "Too many requests, please try again after 1 minutes." },
});

const speedLimiter = slowDown({
  windowMs: 60 * 1000, // 1 minutes
  delayAfter: 1, // add dealy after 1 requests
  delayMs: 200, // begin adding 200ms of delay per request
});

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: "https://code-verse-app.netlify.app",
  })
);

app.use(limiter);
app.use(speedLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(validateApiKey);

app.use("/api/ping", pingRoute);
app.use("/api/execute", codeExecuteRoute);

app.listen(port, () => {
  console.log("now listending on port", port);
});


cron.schedule("*/14 * * * *", async () => {
  try {
    const response = await axios({
      method: "GET",
      url: SERVER_URL + "/api/ping",
      headers: {
        "x-api-key": process.env.API_KEY,
      },
    });
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
});
