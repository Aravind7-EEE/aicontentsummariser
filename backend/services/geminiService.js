import { GoogleGenAI } from '@google/genai';

const buildPrompt = (content) => {
  return `You are an expert AI Content Summarizer.

Your task is to analyze the provided content and generate a high-quality summary.

Instructions:
- Preserve all important information.
- Remove repetition and unnecessary details.
- Maintain factual accuracy.
- Use simple and professional language.
- Keep the summary concise and readable.
- If the content contains key points, return them in bullet format.
- If the content is short, provide a brief summary.
- Do not add information that is not present in the content.

Content:
${content}

Generate the best possible summary.`;
};

export const generateSummary = async (content) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is required to call the Gemini API.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = buildPrompt(content);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
      temperature: 0.2,
      maxOutputTokens: 450
    });

    const outputText = response?.text || '';

    if (!outputText) {
      throw new Error('Gemini did not return a summary.');
    }

    return outputText.trim();
  } catch (err) {
    console.error('Gemini API error, falling back to local summarizer:', err.message || err);
    // Local extractive fallback summarizer
    return localFallbackSummary(content);
  }
};

const localFallbackSummary = (text, maxSentences = 4) => {
  const stopwords = new Set(['the','is','in','and','to','of','a','that','it','for','on','with','as','was','were','be','by','this','are','an']);

  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length <= maxSentences) return sentences.join(' ');

  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const freq = {};
  for (const w of words) {
    if (stopwords.has(w)) continue;
    freq[w] = (freq[w] || 0) + 1;
  }

  const scoreSentence = (s) => {
    return s.toLowerCase().split(/[^a-z0-9]+/).reduce((sum, w) => sum + (freq[w] || 0), 0);
  };

  const scored = sentences.map((s, idx) => ({ s, idx, score: scoreSentence(s) }));
  scored.sort((a,b) => b.score - a.score);
  const top = scored.slice(0, maxSentences).sort((a,b) => a.idx - b.idx).map(x => x.s);
  return top.join(' ');
};
