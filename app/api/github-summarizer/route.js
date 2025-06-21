import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { summarizeReadme } from '../../lib/githubSummarizer';

// POST /api/github-summarizer
// Body: { "key": "<api_key_value>", ...optional payload }
// Validates the API key exactly like /api/validate-key. If the key is valid,
// it returns a placeholder response (you can replace this with the actual
// GitHub-summary logic later).

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch (_) {
      // Ignore JSON parse errors (likely empty body)
    }

    // Try to find the key in body first, then in common header names
    const key =
      body.key ||
      request.headers.get('key') ||
      request.headers.get('api-key') ||
      request.headers.get('x-api-key');

    const rest = { ...body };

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const valid = !!data;

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (!rest.githubURL || typeof rest.githubURL !== 'string') {
      return NextResponse.json(
        { error: 'Missing "githubURL" field with the repository URL.' },
        { status: 400 }
      );
    }

    try {
      const readme = await getReadmeContent(rest.githubURL);
      const summaryObj = await summarizeReadme(readme);

      return NextResponse.json({
        success: true,
        ...summaryObj,
      });
    } catch (summaryErr) {
      return NextResponse.json(
        { error: summaryErr.message },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

async function getReadmeContent(input) {
  try {
    let owner, repo;

    if (input.includes('github.com')) {
      const match = input.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) throw new Error('Could not parse GitHub URL');
      [, owner, repo] = match;
    } else {
      const parts = input.split('/');
      if (parts.length !== 2) throw new Error('Invalid repo format. Expected "owner/repo"');
      [owner, repo] = parts;
    }
    
    // Remove .git suffix if present
    const cleanRepo = repo.replace(/\.git$/, '');
    
    // Fetch README content from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${cleanRepo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'GitHub-Readme-Fetcher'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('README.md not found in this repository');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const readmeContent = await response.text();
    return readmeContent;
  } catch (error) {
    throw new Error(`Failed to fetch README: ${error.message}`);
  }
}

// (summarizeReadme now lives in lib/githubSummarizer.js)

// async function summarizeRepository(readmeContent) {
//   // Create the chat model
//   const model = new ChatOpenAI({
//     temperature: 0.7,
//     modelName: "gpt-3.5-turbo"
//   });
//
//   // Create the prompt template
//   const prompt = ChatPromptTemplate.fromMessages([
//     [
//       "system",
//       "You are a helpful assistant that summarizes GitHub repositories based on their README content. Provide a concise summary and list some interesting facts about the project."
//     ],
//     [
//       "human",
//       "Summarize this GitHub repository from this README file content:\n\n{readmeContent}\n\nPlease provide your response in the following JSON format:\n{{\n  \"summary\": \"A concise summary of the repository\",\n  \"cool_facts\": [\"fact 1\", \"fact 2\", \"fact 3\"]\n}}"
//     ]
//   ]);
//
//   // Create the chain using RunnableSequence (modern approach)
//   const chain = RunnableSequence.from([
//     prompt,
//     model,
//     new StringOutputParser()
//   ]);
//
//   try {
//     // Invoke the chain with the README content
//     const result = await chain.invoke({
//       readmeContent: readmeContent
//     });
//
//     // The model may wrap JSON in markdown ```json fences; strip them if present
//     const cleaned = result
//       .replace(/^```json\s*/i, '')
//       .replace(/^```\s*/i, '')
//       .replace(/```\s*$/i, '');
//
//     // Zod schema for summary validation
//     const SummarySchema = z.object({
//       summary: z.string(),
//       cool_facts: z.array(z.string())
//     });
//     let parsedResult;
//     try {
//       parsedResult = SummarySchema.parse(JSON.parse(cleaned));
//     } catch (_) {
//       // If parsing fails, return the raw text as summary
//       return { summary: result, cool_facts: [] };
//     }
//
//     return parsedResult;
//   } catch (error) {
//     throw new Error(`Failed to summarize repository: ${error.message}`);
//   }
// } 