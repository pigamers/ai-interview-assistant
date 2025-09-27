// AI Service for interview questions and scoring
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateQuestion = async (difficulty, questionNumber) => {
  try {
    let prompt;
    
    if (difficulty === 'easy') {
      prompt = `Generate a simple one-word or very short answer question about React/Node.js basics. Question ${questionNumber}/6. Examples: "What does JSX stand for?" or "Name a React hook." Keep it simple for 20-second answers.`;
    } else if (difficulty === 'medium') {
      prompt = `Generate a short-answer question about React/Node.js that can be answered in 1-2 sentences. Question ${questionNumber}/6. Focus on concepts that need brief explanations.`;
    } else {
      prompt = `Generate a React/Node.js question requiring a detailed explanation in less than 100 words. Question ${questionNumber}/6. Ask about best practices, architecture, or problem-solving approaches.`;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert technical interviewer specializing in full-stack development.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 150,
    });

    const content = chatCompletion.choices[0]?.message?.content;

    const finalContent = content?.trim();
    
    if (!finalContent || finalContent.length < 5) {
      throw new Error('Empty or invalid response from AI');
    }

    return finalContent;
  } catch (error) {
    console.error('AI API failed:', error);
    throw new Error('AI service is currently unavailable. Please try again in a few moments.');
  }
};

export const scoreAnswer = async (question, answer, difficulty) => {
  if (!answer || answer.trim() === '' || answer === 'No answer provided') {
    return { score: 0, feedback: 'No answer provided' };
  }

  // Define max marks based on difficulty
  const maxMarks = { easy: 10, medium: 20, hard: 30 };
  const totalMarks = maxMarks[difficulty];

  try {
    const prompt = `Evaluate this full-stack developer interview answer:

Question (${difficulty} level): ${question}
Candidate Answer: ${answer}

Scoring Criteria:
- Technical accuracy (40%)
- Completeness of answer (30%)
- Code quality/best practices (20%)
- Communication clarity (10%)

This is a ${difficulty} question worth ${totalMarks} marks total.

Provide your evaluation in this exact JSON format:
{
  "score": [number from 0-${totalMarks}],
  "feedback": "[brief constructive feedback]"
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert technical interviewer. Evaluate answers fairly and provide constructive feedback.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 200,
    });

    const rawContent = chatCompletion.choices[0].message.content;
    // Clean the content to remove control characters
    const cleanContent = rawContent.replace(/[\x00-\x1F\x7F]/g, '');
    const result = JSON.parse(cleanContent);

    return {
      score: Math.max(0, Math.min(totalMarks, result.score)), // Ensure 0-totalMarks range
      feedback: result.feedback
    };
  } catch (error) {
    console.error('AI scoring failed:', error);
    // Fallback scoring if JSON parsing fails
    if (error instanceof SyntaxError) {
      const fallbackScore = Math.floor(Math.random() * (totalMarks + 1));
      return {
        score: fallbackScore,
        feedback: 'AI scoring temporarily unavailable. Random score assigned.'
      };
    }
    throw new Error('AI scoring service is currently unavailable. Please try again in a few moments.');
  }
};

export const generateSummary = async (candidateData, questions, answers) => {
  try {
    const totalScore = answers.reduce((sum, ans) => sum + (ans.score || 0), 0);
    const avgScore = Math.round(totalScore / answers.length);

    const prompt = `Create a professional interview summary for this candidate:

Candidate: ${candidateData.name}
Overall Score: ${avgScore}/100

Interview Performance:
${questions.map((q, i) => `Q${i + 1} (${q.difficulty}): ${q.text}\nAnswer: ${answers[i]?.text || 'No answer provided'}\nScore: ${answers[i]?.score || 0}/100`).join('\n\n')}

Provide a concise 2-3 sentence professional summary highlighting:
- Overall technical competency
- Key strengths or areas for improvement
- Hiring recommendation context`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an HR professional creating candidate evaluation summaries. Be objective and constructive.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 150,
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI summary failed:', error);
    throw new Error('AI summary service is currently unavailable. Please try again in a few moments.');
  }
};