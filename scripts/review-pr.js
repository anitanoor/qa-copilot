const { Octokit } = require('@octokit/rest');
const { OpenAI } = require('openai');
const fs = require('fs');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getChangedFiles() {
  const { data: files } = await octokit.pulls.listFiles({
    owner: process.env.GITHUB_REPOSITORY.split('/')[0],
    repo: process.env.GITHUB_REPOSITORY.split('/')[1],
    pull_number: process.env.PR_NUMBER,
  });

  return files;
}

async function analyzeTestCases(files) {
  const testCases = [];
  
  for (const file of files) {
    if (file.filename.endsWith('.test.js') || file.filename.endsWith('.spec.js')) {
      const { data: content } = await octokit.repos.getContent({
        owner: process.env.GITHUB_REPOSITORY.split('/')[0],
        repo: process.env.GITHUB_REPOSITORY.split('/')[1],
        path: file.filename,
        ref: process.env.PR_HEAD_SHA,
      });

      const fileContent = Buffer.from(content.content, 'base64').toString();
      testCases.push({
        filename: file.filename,
        content: fileContent,
      });
    }
  }

  return testCases;
}

async function reviewTestCases(testCases) {
  const reviews = [];

  for (const testCase of testCases) {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a QA expert reviewing test cases. Analyze the test case for structure, completeness, edge cases, and potential risks."
        },
        {
          role: "user",
          content: `Review the following test case from ${testCase.filename}:\n\n${testCase.content}`
        }
      ],
    });

    reviews.push({
      filename: testCase.filename,
      review: response.choices[0].message.content,
    });
  }

  return reviews;
}

async function main() {
  try {
    const files = await getChangedFiles();
    const testCases = await analyzeTestCases(files);
    const reviews = await reviewTestCases(testCases);

    // Write review results to file
    fs.writeFileSync('review.json', JSON.stringify({
      structureAnalysis: reviews.map(r => `### ${r.filename}\n${r.review}`).join('\n\n'),
      edgeCases: reviews.flatMap(r => r.review.match(/edge case:.*$/gim) || []),
      riskAssessment: reviews.map(r => r.review.match(/risk:.*$/gim) || []).flat(),
      suggestions: reviews.map(r => r.review.match(/suggestion:.*$/gim) || []).flat(),
    }, null, 2));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 