import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
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
  // Chat model now reads the API key from the environment
  const model = new ChatOpenAI({
    temperature: 0.7,
    modelName: "gpt-3.5-turbo",
  }).withStructuredOutput(SummarySchema);

  // Update the prompt to omit manual JSON instructions—the wrapper will handle formatting
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant that summarizes GitHub repositories based on their README content. Provide a concise summary and list some interesting facts about the project. Respond using the output schema provided.",
    ],
    [
      "human",
      "Summarize this GitHub repository from this README file content:\n\n{readmeContent}",
    ],
  ]);

  const chain = RunnableSequence.from([
    prompt,
    model, // model already returns structured object
  ]);

  // Invoke the chain and directly return the structured object
  return chain.invoke({ readmeContent });
} 