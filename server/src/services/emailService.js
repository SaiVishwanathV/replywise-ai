import axios from "axios";
export { sendOTPEmail } from "./otpService.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.5-flash";

const callOpenRouter = async (prompt, systemInstruction = "") => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.includes("dummy")) {
    console.warn("OpenRouter API key missing/dummy. Using local fallback.");
    return null;
  }

  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content:
              systemInstruction ||
              "You are an elite AI email assistant. Craft professional, clear, and well-structured email responses.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5173",
          "X-Title": "ReplyWise AI",
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;
    return reply ? reply.trim() : null;
  } catch (err) {
    console.error("OpenRouter API Call Error:", err.response?.data || err.message);
    return null;
  }
};

export const generateReply = async ({
  originalEmail,
  tone = "Professional",
  length = "Medium",
  customInstructions = "",
}) => {
  const prompt = `Original Email:
"""
${originalEmail}
"""

Instructions:
- Tone: ${tone}
- Desired Length: ${length}
${customInstructions ? `- Custom Instruction: ${customInstructions}` : ""}

Please generate a complete, well-written reply to this email matching the tone and length requirements. Do not include markdown code block wrappers around the email unless helpful.`;

  const aiReply = await callOpenRouter(prompt);

  if (aiReply) return aiReply;

  // Smart fallback response
  return `Subject: Re: Follow-up regarding your message

Thank you for reaching out. I have reviewed your email regarding "${originalEmail.slice(0, 40).replace(/\n/g, " ")}...".

I appreciate you sharing these details with me. ${
    customInstructions ? `Regarding your request: ${customInstructions}. ` : ""
  }Everything looks clear on my end, and I am happy to proceed accordingly.

Please let me know if you need any additional information or have further questions.

Best regards,`;
};

export const rewriteReply = async ({
  originalEmail,
  existingReply = "",
  tone = "Professional",
  length = "Medium",
  customInstructions = "",
}) => {
  const prompt = `Original Email:
"""
${originalEmail}
"""

Current Reply Draft:
"""
${existingReply}
"""

Rewrite Instructions:
- Target Tone: ${tone}
- Target Length: ${length}
${customInstructions ? `- Custom Instruction: ${customInstructions}` : ""}

Please rewrite the draft reply to be more compelling, accurate, and aligned with the target tone and length.`;

  const aiReply = await callOpenRouter(prompt);

  if (aiReply) return aiReply;

  return `Subject: Re: Updated Response

${existingReply ? `[Rewritten - ${tone} Tone]:\n` + existingReply : `Thank you for your message. Here is an updated response in a ${tone.toLowerCase()} tone.`}`;
};

export const summarizeEmail = async ({ originalEmail }) => {
  const prompt = `Summarize the following email concisely and extract 3 key action items:

Email:
"""
${originalEmail}
"""

Format output as JSON:
{
  "summary": "Short executive summary paragraph",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
}`;

  const systemInstruction =
    "You are an executive email summarizer. Respond ONLY with valid JSON.";

  const aiResponse = await callOpenRouter(prompt, systemInstruction);

  if (aiResponse) {
    try {
      const cleanJsonStr = aiResponse.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJsonStr);
      return {
        summary: parsed.summary || aiResponse,
        keyPoints: parsed.keyPoints || [],
      };
    } catch {
      return { summary: aiResponse, keyPoints: [] };
    }
  }

  // Fallback
  return {
    summary: `Summary: The email discusses key updates regarding "${originalEmail.slice(0, 60).replace(/\n/g, " ")}..." and requires follow-up.`,
    keyPoints: [
      "Review the core message and requirements",
      "Confirm action items and timeline",
      "Respond with preferred tone and instructions",
    ],
  };
};
