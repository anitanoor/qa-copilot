import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { testCase } = await request.json();

    // Structure validation prompt
    const structurePrompt = `
      Analyze the following test case for proper structure and completeness:
      ${testCase}
      
      Provide feedback on:
      1. Test case format and structure
      2. Missing required sections
      3. Clarity and completeness
    `;

    // Edge cases prompt
    const edgeCasesPrompt = `
      Analyze the following test case and suggest potential edge cases that should be considered:
      ${testCase}
      
      Focus on:
      1. Boundary conditions
      2. Error scenarios
      3. Unusual input combinations
    `;

    // Risk assessment prompt
    const riskPrompt = `
      Assess the risk level of the following test case:
      ${testCase}
      
      Consider:
      1. Complexity of the functionality
      2. Potential impact on users
      3. Dependencies and integration points
    `;

    // Make parallel API calls to OpenAI
    const [structureResponse, edgeCasesResponse, riskResponse] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: structurePrompt }],
      }),
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: edgeCasesPrompt }],
      }),
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: riskPrompt }],
      }),
    ]);

    // Process responses
    const structureFeedback = structureResponse.choices[0].message.content;
    const edgeCases = edgeCasesResponse.choices[0].message.content?.split('\n').filter(Boolean) || [];
    const riskAssessment = riskResponse.choices[0].message.content;

    // Calculate risk score (0-100)
    const riskScore = Math.min(100, Math.max(0, 
      riskAssessment.toLowerCase().includes('high') ? 80 :
      riskAssessment.toLowerCase().includes('medium') ? 50 :
      riskAssessment.toLowerCase().includes('low') ? 20 : 50
    ));

    return NextResponse.json({
      structureValidation: {
        isValid: !structureFeedback.toLowerCase().includes('missing') && 
                 !structureFeedback.toLowerCase().includes('incomplete'),
        feedback: structureFeedback,
      },
      edgeCases,
      riskScore,
      suggestions: [
        ...edgeCases,
        structureFeedback,
        riskAssessment,
      ].filter(Boolean),
    });
  } catch (error) {
    console.error('Error processing test case:', error);
    return NextResponse.json(
      { error: 'Failed to process test case' },
      { status: 500 }
    );
  }
}

