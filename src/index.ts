import { Request, Response } from "express";
import openAiSTT from "./requests/stt";
import openAiTTS from "./requests/tts";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/stt", upload.single("audio"), async (req: any, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const file = req.file;
    const response = await openAiSTT(file);
    if (response) {
      return res.status(200).json({ status: "success", text: response });
    }
  } catch (e: any) {
    console.error(e);
    res.json({ error: "Failed" + e });
  }
});

app.get("/api/tts", async (req: any, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text uploaded" });
    }
    const response = await openAiTTS(text);
    if (response) {
      return res.status(200).json({ status: "success", text: response });
    }
  } catch (e: any) {
    console.error(e);
    res.json({ error: "Failed" + e });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
