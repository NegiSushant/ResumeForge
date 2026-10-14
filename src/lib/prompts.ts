export function createAnalysisPrompt(resumeText: string, jdText: string) {
  return `
You are an expert technical recruiter. Analyze the resume against the job description.

JOB DESCRIPTION:
${jdText}

RESUME:
${resumeText}

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):

{
  "fitScore": number,
  "summary": "string",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "suggestedImprovements": [
    {
      "section": "string",
      "suggestion": "string"
    }
  ],
  "keywordGaps": ["keyword1", "keyword2"]
}

Strict rules for the small model:
- fitScore must be an integer between 0 and 100.
- matchingSkills = skills that actually appear in the resume AND are required in the JD.
- missingSkills = important skills from the JD that are missing or very weak in the resume.
- Be honest. If the resume is weak, give a low fitScore.
- Keep arrays short (max 5-6 items).
- suggestedImprovements: give 2-4 practical, specific suggestions.
- Return pure JSON only.
`;
}

// export function createAnalysisPrompt(resumeText: string, jdText: string) {
//   return `
// You are an expert resume analyst and career coach.

// Analyze the following resume against the job description.

// ### JOB DESCRIPTION:
// ${jdText}

// ### RESUME:
// ${resumeText}

// Return a valid JSON object with exactly this structure:

// {
//   "fitScore": number,                  // 0-100
//   "summary": "string",                 // 2-3 sentence overall assessment
//   "matchingSkills": ["skill1", "skill2"],
//   "missingSkills": ["skill1", "skill2"],
//   "strengths": ["point1", "point2"],
//   "weaknesses": ["point1", "point2"],
//   "suggestedImprovements": [
//     {
//       "section": "Experience / Skills / Summary / etc.",
//       "original": "original text if relevant",
//       "suggestion": "improved version or advice"
//     }
//   ],
//   "keywordGaps": ["keyword1", "keyword2"]
// }

// Rules:
// - Be honest and specific.
// - fitScore should reflect real match quality.
// - suggestedImprovements should be actionable.
// - Return ONLY the raw JSON object.
// - Do NOT wrap the JSON in \`\`\`json or any markdown.
// `;
// }
