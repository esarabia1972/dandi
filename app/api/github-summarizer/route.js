import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { summarizeReadme } from '../../lib/githubSummarizer';

// POST /api/github-summarizer
// Body: { "key": "<api_key_value>", ...optional payload }
// Validates the API key exactly like /api/validate-key. If the key is valid,
// it returns a placeholder response (you can replace this with the actual
// GitHub-summary logic later).

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Validate the API key against the current user
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', apiKey)
      .eq('user_id', session.user.id)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json({ error: 'Invalid or unauthorized API key' }, { status: 403 });
    }

    const body = await request.json();
    const { repoUrl } = body;

    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json({ error: 'Missing "repoUrl" field.' }, { status: 400 });
    }

    try {
      // The key has been validated; now we call the summarizer which uses the env key
      const readme = await getReadmeContent(repoUrl);
      const summaryObj = await summarizeReadme(readme);

      return NextResponse.json({
        summary: summaryObj,
      });
    } catch (summaryErr) {
      return NextResponse.json({ error: summaryErr.message }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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
    
    const cleanRepo = repo.replace(/\.git$/, '');
    
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