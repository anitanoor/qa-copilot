import { OpenAI } from 'openai';
import NodeCache from 'node-cache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache responses for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// Specialized prompts for different types of analysis
const PROMPTS = {
  structure: `
    Analyze the test case structure and provide feedback on:
    1. Test case format and organization
    2. Required sections (preconditions, steps, expected results)
    3. Clarity and completeness
    4. Test data coverage
    5. Dependencies and setup requirements
  `,
  
  edgeCases: `
    Identify potential edge cases and boundary conditions:
    1. Input boundary values
    2. Error scenarios and exception handling
    3. State transitions and race conditions
    4. Performance and load conditions
    5. Security and data validation
  `,
  
  risk: `
    Assess the risk level and potential impact:
    1. Complexity of the functionality
    2. User impact and business criticality
    3. Integration points and dependencies
    4. Data sensitivity and security concerns
    5. Performance and scalability considerations
  `,
  
  coverage: `
    Evaluate test coverage and suggest improvements:
    1. Functional coverage
    2. Edge case coverage
    3. Error scenario coverage
    4. Performance test coverage
    5. Security test coverage
  `,
};

export async function analyzeTestCase(testCase: string, analysisType: keyof typeof PROMPTS) {
  const cacheKey = `${analysisType}:${testCase}`;
  const cachedResult = cache.get(cacheKey);
  
  if (cachedResult) {
    return cachedResult;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a QA expert specializing in test case analysis and review."
      },
      {
        role: "user",
        content: `${PROMPTS[analysisType]}\n\nTest Case:\n${testCase}`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const result = response.choices[0].message.content;
  cache.set(cacheKey, result);
  
  return result;
}

export async function analyzeTestSuite(testCases: string[]) {
  const suiteAnalysis = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a QA expert analyzing a test suite for coverage and quality."
      },
      {
        role: "user",
        content: `Analyze the following test suite for overall quality and coverage:\n\n${testCases.join('\n\n')}`
      }
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return suiteAnalysis.choices[0].message.content;
}

export async function suggestImprovements(testCase: string, analysis: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a QA expert providing actionable improvements for test cases."
      },
      {
        role: "user",
        content: `Based on the following analysis, suggest specific improvements for the test case:\n\nAnalysis:\n${analysis}\n\nTest Case:\n${testCase}`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return response.choices[0].message.content;
}

export function clearCache() {
  cache.flushAll();
} 