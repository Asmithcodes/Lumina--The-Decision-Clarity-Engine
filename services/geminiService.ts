// Cloudflare Worker proxy URL - no API key needed in frontend!
const WORKER_URL = 'https://lumina-gemini-proxy.lumina-proxy.workers.dev';

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
      const text = await this.callWorkerAPI(prompt, MODEL_PRIMARY);
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
      const text = await this.callWorkerAPI(prompt, MODEL_PRIMARY);
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Analysis Failed:", error);
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
      console.error(`[Lumina] Worker API call failed:`, error);
      console.error(`[Lumina] Error message:`, msg);
      
      // Throw user-friendly errors
      if (msg.includes('403') || msg.includes('Forbidden')) {
        alert('CORS Error: The Worker is blocking localhost. Deploying to GitHub Pages will fix this.');
        throw new Error('INVALID_KEY');
      }
      if (msg.includes('429') || msg.includes('quota')) {
        throw new Error('QUOTA_EXHAUSTED');
      }
      
      alert(`Error calling Worker: ${msg}`);
      throw new Error('GENERIC_ERROR');
    }
  }
}