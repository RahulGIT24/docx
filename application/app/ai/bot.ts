import logger from "@/lib/logger";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function aiWrite(query: string) {
  try {
    const chatCompletion = await getGroqChatCompletion(query);
    return chatCompletion?.choices[0]?.message?.content || "";
  } catch (err) {
    if (err instanceof Groq.APIError) {
      logger.error(`Error while AI API Calling: Status Code -> ${err.status} Error name -> ${err.name}`);
    } else {
      logger.error("Unknow Error from AI API Call " + err);
    }
  }
}

async function getGroqChatCompletion(query: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: query,
      },
    ],
    model: "llama-3.3-70b-versatile",
  })
    .catch(async (err) => {
      throw err
    });
}