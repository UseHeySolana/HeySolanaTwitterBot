import OpenAI from "openai";
import * as fs from "fs";
import * as file from "fs/promises";
import * as path from "path";
import * as os from "os";

const openAiSTT = async (audioFile: any) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // Create a temporary file
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `audio_${Date.now()}.mp3`);

  // Convert File to ArrayBuffer and then to Buffer
  const arrayBuffer = await audioFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Write to temporary file
  await file.writeFile(tempFilePath, buffer);

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(tempFilePath),
    model: "whisper-1",
  });

  // Clean up temporary file
  await file.unlink(tempFilePath);

  return transcription.text;
};

export default openAiSTT;
