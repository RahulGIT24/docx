import logger from "@/lib/logger";
import Groq from "groq-sdk";
import { get_prompt } from "./prompt";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function aiWrite(query: string) {
  try {
    const prompt = get_prompt(query);
    const chatCompletion = await getGroqChatCompletion(prompt);
    return chatCompletion?.choices[0]?.message?.content || "";
  } catch (err) {
    if (err instanceof Groq.APIError) {
      logger.error(`Error while AI API Calling: Status Code -> ${err.status} Error name -> ${err.name}`);
    } else {
      logger.error("Unknow Error from AI API Call " + err);
    }
  }
}

async function getGroqChatCompletion(prompt: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  })
    .catch(async (err) => {
      throw err
    });
}