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

  // Generate 5 deep Socratic questions with Fallback Strategy
  async generateQuestions(dilemma: string): Promise<string[]> {
    const prompt = `The user is facing this dilemma: "${dilemma}". 
    Act as a ruthless interrogator who cuts through lies and excuses. Be brutal and piercing, but use simple words.
    Generate exactly 5 devastating questions using plain language that expose their deepest fears, lies they tell themselves, and things they refuse to admit.
    
    Structure:
    1. What is the real reason this bothers them? (Not the surface excuse)
    2. What lie are they telling themselves to feel better?
    3. Who are they really trying to protect or please, and why?
    4. What will they lose or become if they keep avoiding this?
    5. What truth are they most terrified to face?

    Dig deep. Attack their comfort zones. Force brutal self-honesty. Use simple, sharp language that cuts to the bone.
    Return ONLY a JSON array of strings.`;

    try {
      // Use the new Retry Cascade
      const text = await this.callWithRetry(prompt);
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Generate Questions Failed:", error);
      throw error;
    }
  }

  // Generate final clarity analysis with Fallback Strategy
  async generateAnalysis(dilemma: string, qaPairs: { q: string, a: string }[]): Promise<any> {
    const conversation = qaPairs.map(p => `Q: ${p.q}\nA: ${p.a}`).join('\n');
    const prompt = `
      Dilemma: "${dilemma}"
      
      User's answers:
      ${conversation}
      
      Strip away all their excuses and self-deception. Expose the ugly truth they're hiding from.
      1. What core truth are they desperately avoiding? (Not what they want to believe, but what they KNOW deep down)
      2. What blind spot or lie keeps them stuck? (What pattern are they repeating?)
      3. What is the one hard action they must take? (The thing they're most afraid to do)
      
      Be brutally honest and cut deep, but use simple words. Destroy their comfortable illusions.
      
      Return ONLY a JSON object with these exact keys:
      {
        "coreTruth": "The brutal truth they avoid",
        "blindSpot": "The lie lying to themselves",
        "actionableStep": "The one hard thing they must do"
      }
    `;

    try {
      // Use the new Retry Cascade
      const text = await this.callWithRetry(prompt);
      return JSON.parse(text);
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