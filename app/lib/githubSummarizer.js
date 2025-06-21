import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Zod schema that the LLM must satisfy
export const SummarySchema = z.object({
  summary: z.string(),
  cool_facts: z.array(z.string()),
});

/**
 * Summarize a GitHub repo README string using LangChain + OpenAI.
 * Returns an object that matches SummarySchema.
 */
export async function summarizeReadme(readmeContent) {
  // Chat model
  const model = new ChatOpenAI({
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
  });

  // Prompt asking for JSON response. Double braces escape LC variable syntax.
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant that summarizes GitHub repositories based on their README content. Provide a concise summary and list some interesting facts about the project.",
    ],
    [
      "human",
      "Summarize this GitHub repository from this README file content:\n\n{readmeContent}\n\nPlease provide your response in the following JSON format:\n{{\n  \"summary\": \"A concise summary of the repository\",\n  \"cool_facts\": [\"fact 1\", \"fact 2\", \"fact 3\"]\n}}",
    ],
  ]);

  const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);

  const resultText = await chain.invoke({ readmeContent });

  // Remove markdown fences the model might return
  const cleaned = resultText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  // Validate via Zod (will throw on mismatch)
  const parsed = SummarySchema.parse(JSON.parse(cleaned));
  return parsed;
} 