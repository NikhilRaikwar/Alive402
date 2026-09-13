import OpenAI from "openai";
import { env } from "./env";

export async function runInference(prompt: string) {
  if (!env.openRouterKey) throw new Error("OPENROUTER_API_KEY is not configured");
  const client = new OpenAI({
    apiKey: env.openRouterKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: { "HTTP-Referer": env.publicUrl, "X-Title": "Alive402" },
  });
  const result = await client.chat.completions.create({
    model: env.openRouterModel,
    messages: [
      {
        role: "system",
        content:
          "Answer clearly in no more than 120 words. You are the Alive402 demo research assistant.",
      },
      { role: "user", content: prompt },
    ],
  });
  return result.choices[0]?.message.content ?? "The model returned no text.";
}
