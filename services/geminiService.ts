// Cloudflare Worker proxy URL - no API key needed in frontend!
// Cloudflare Worker proxy URL - configurable via .env
const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787';

// Priority Cascade Models
// Priority Cascade Models
const MODEL_PRIMARY = 'gemini-2.5-flash';
const MODEL_FALLBACK = 'gemini-2.5-flash-lite';

export class GeminiService {
  private workerUrl: string;

  constructor() {
    this.workerUrl = WORKER_URL;
  }

  // Helper to remove Markdown code blocks (```json ... ```)
  private cleanJson(text: string): string {
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!cleaned) return '{}'; // Prevent empty string parsing error
    return cleaned;
  }

  // Generate 5 plain-language, easy-to-understand questions with Fallback Strategy
  async generateQuestions(dilemma: string): Promise<string[]> {
    const prompt = `The user is dealing with this situation: "${dilemma}". 

    Your job is to help them think more clearly about their decision.
    Generate exactly 5 simple, direct questions that help them reflect on what matters most to them.
    
    Rules for the questions:
    - Use plain, everyday language. Avoid jargon, metaphors, or complex wording.
    - Each question should be SHORT (one sentence) and easy for anyone to understand.
    - Questions should help the user uncover what they truly want, what they are afraid of, and what is holding them back.
    - Do NOT ask multiple things in one question. Keep it focused.
    - The questions should follow this flow:
      1. Ask what outcome they are really hoping for (their true goal).
      2. Ask what is the main thing stopping them right now (their biggest obstacle).
      3. Ask who else is affected by this decision and how that makes them feel.
      4. Ask what they think will happen if they do nothing and let time decide.
      5. Ask what small step they could take today that would move them in the right direction.

    Return ONLY a JSON array of 5 strings. No extra text, no markdown, just the JSON array.`;

    try {
      const text = await this.callWithRetry(prompt);
      console.log("[Lumina] Raw Questions Response:", text); // Debug log
      const cleaned = this.cleanJson(text);
      try {
        return JSON.parse(cleaned);
      } catch (e) {
        console.error("[Lumina] JSON Parse Error (Questions):", cleaned);
        throw new Error("Invalid JSON from AI");
      }
    } catch (error) {
      console.error("Gemini Generate Questions Failed:", error);
      throw error;
    }
  }

  // Generate final clarity analysis — opinionated and decisive — with Fallback Strategy
  async generateAnalysis(dilemma: string, qaPairs: { q: string, a: string }[]): Promise<any> {
    const conversation = qaPairs.map(p => `Q: ${p.q}\nA: ${p.a}`).join('\n');
    const prompt = `
      The user is dealing with this situation: "${dilemma}"
      
      Here is what they revealed through their answers:
      ${conversation}
      
      Based on everything they have shared, your job is to give them a clear, honest, and decisive recommendation.
      You are NOT a neutral advisor — you are a trusted friend who has listened carefully and now tells them exactly what they should do.
      
      Instructions:
      1. "coreTruth": In 1–2 plain sentences, summarize the key insight from their answers — what does this situation really come down to for them? Use simple, direct language.
      2. "blindSpot": In 1–2 plain sentences, point out the one thing they may be overlooking or underestimating. Keep it clear and kind, not harsh.
      3. "actionableStep": THIS IS THE MOST IMPORTANT PART. Based on all their answers, give ONE clear, specific recommendation. Tell them exactly what you think they should do. Commit to a direction — do NOT say "it depends" or give two options. Be decisive and encouraging. Use plain language. Write it as if you are saying: "Based on everything you told me, I think you should..."
      
      Return ONLY a JSON object with these exact keys:
      {
        "coreTruth": "Key insight from their situation in simple language",
        "blindSpot": "The thing they may be overlooking",
        "actionableStep": "Your clear, specific, opinionated recommendation for them"
      }
    `;

    try {
      const text = await this.callWithRetry(prompt);
      console.log("[Lumina] Raw Analysis Response:", text); // Debug log

      const cleaned = this.cleanJson(text);
      if (cleaned === '{}') throw new Error("Empty response from AI");

      try {
        return JSON.parse(cleaned);
      } catch (parseError) {
        console.error("[Lumina] JSON Parse Error (Analysis):", cleaned);
        throw new Error("Invalid JSON structure from AI");
      }
    } catch (error) {
      console.error("Gemini Analysis Failed:", error);
      throw error;
    }
  }

  /**
   * The Double-Model Efficiency Cascade
   * 1. Try Primary Model (Flash 2.5)
   * 2. If 429 Quota Exceeded -> Fallback to Flash Lite
   * 3. If both fail -> Throw error (UI triggers override)
   */
  private async callWithRetry(prompt: string): Promise<string> {
    try {
      return await this.callWorkerAPI(prompt, MODEL_PRIMARY);
    } catch (error: any) {
      if (error.message === 'QUOTA_EXHAUSTED') {
        console.warn(`[Lumina] Primary model quota hit. Switching to FALLBACK: ${MODEL_FALLBACK}`);
        return await this.callWorkerAPI(prompt, MODEL_FALLBACK);
      }
      throw error;
    }
  }

  /**
   * Call Cloudflare Worker API
   * The Worker handles API key security and calls Google Gemini
   */
  private async callWorkerAPI(prompt: string, model: string): Promise<string> {
    try {
      console.log(`[Lumina] Calling Worker at: ${this.workerUrl}`);
      console.log(`[Lumina] Model: ${model}`);
      console.log(`[Lumina] Prompt length: ${prompt.length} characters`);

      const response = await fetch(this.workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, model }),
      });

      console.log(`[Lumina] Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Lumina] Error response:`, errorText);

        // Check for Quota Error in the response text directly to be safe
        if (errorText.includes('429') || errorText.includes('quota') || response.status === 429) {
          throw new Error('QUOTA_EXHAUSTED');
        }

        throw new Error(`Worker error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`[Lumina] Response data:`, data);

      if (!data.text) {
        throw new Error('No text in response from worker');
      }

      console.log(`[Lumina] Worker response received successfully`);
      return data.text;

    } catch (error: any) {
      const msg = error.message || error.toString();

      // Propagate the specific QUOTA error so the retry logic catches it
      if (msg === 'QUOTA_EXHAUSTED' || msg.includes('QUOTA_EXHAUSTED')) {
        throw new Error('QUOTA_EXHAUSTED');
      }

      if (msg.includes('403') || msg.includes('Forbidden')) {
        alert('CORS Error: The Worker is blocking localhost. Deploying to GitHub Pages will fix this.');
        throw new Error('INVALID_KEY');
      }

      // Checking for quota in strict error object
      if (msg.includes('429') || msg.includes('quota')) {
        throw new Error('QUOTA_EXHAUSTED');
      }

      console.error(`[Lumina] Worker API call failed:`, error);
      throw new Error('GENERIC_ERROR');
    }
  }
}