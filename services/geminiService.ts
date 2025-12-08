import { GoogleGenAI, Type } from "@google/genai";

// Use provided key or fallback to empty string (which will trigger failsafe in UI)
const DEFAULT_API_KEY = import.meta.env.VITE_API_KEY || '';

// Priority Cascade Models
const MODEL_PRIMARY = 'gemini-2.5-flash';
const MODEL_FALLBACK = 'gemini-2.5-flash-lite';

export class GeminiService {
  private ai: GoogleGenAI;
  private apiKey: string;

  constructor(userKey?: string) {
    this.apiKey = userKey || DEFAULT_API_KEY;
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  // Generate 5 deep Socratic questions with Fallback Strategy
  async generateQuestions(dilemma: string): Promise<string[]> {
    if (!this.apiKey) throw new Error("INVALID_KEY");

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

    const responseSchema = {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    };

    try {
      const text = await this.generateWithFallback(prompt, responseSchema);
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Generate Questions Failed:", error);
      throw error;
    }
  }

  // Generate final clarity analysis with Fallback Strategy
  async generateAnalysis(dilemma: string, qaPairs: { q: string, a: string }[]): Promise<any> {
    if (!this.apiKey) throw new Error("INVALID_KEY");

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
      Return JSON format.
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        coreTruth: { type: Type.STRING },
        blindSpot: { type: Type.STRING },
        actionableStep: { type: Type.STRING }
      },
      required: ["coreTruth", "blindSpot", "actionableStep"]
    };

    try {
      const text = await this.generateWithFallback(prompt, responseSchema);
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini Analysis Failed:", error);
      throw error;
    }
  }

  /**
   * core generation logic with "Double Model" Fallback
   * 1. Try Primary Model (Reasoning/Performance)
   * 2. Catch 429/Quota errors -> Try Fallback Model (Efficiency/Separate Quota)
   * 3. Throw specific errors for UI Failsafe
   */
  private async generateWithFallback(prompt: string, schema: any): Promise<string> {
    const config = {
      responseMimeType: "application/json",
      responseSchema: schema
    };

    try {
      // Priority 1: The Smarter Model
      console.log(`[Lumina] Attempting Primary Model: ${MODEL_PRIMARY}`);
      const response = await this.ai.models.generateContent({
        model: MODEL_PRIMARY,
        contents: prompt,
        config
      });
      
      if (!response.text) throw new Error("EMPTY_RESPONSE");
      return response.text;

    } catch (error: any) {
      const msg = error.message || error.toString();
      
      // Check for Fatal Auth Errors immediately
      if (this.isAuthError(msg)) {
        console.error(`[Lumina] Auth Error on Primary: ${msg}`);
        throw new Error("INVALID_KEY");
      }

      // Check for Quota/Overload Errors
      if (this.isQuotaError(msg)) {
        console.warn(`[Lumina] Primary Model Quota Exceeded. Switching to Fallback: ${MODEL_FALLBACK}`);
        
        try {
          // Priority 2: The Efficiency Model
          const fallbackResponse = await this.ai.models.generateContent({
            model: MODEL_FALLBACK,
            contents: prompt,
            config
          });

          if (!fallbackResponse.text) throw new Error("EMPTY_RESPONSE");
          console.log(`[Lumina] Fallback Model Success.`);
          return fallbackResponse.text;

        } catch (fallbackError: any) {
          const fallbackMsg = fallbackError.message || fallbackError.toString();
          console.error(`[Lumina] Fallback Model Failed: ${fallbackMsg}`);
          
          if (this.isAuthError(fallbackMsg)) {
             throw new Error("INVALID_KEY");
          }
          // If fallback also hits quota or fails
          throw new Error("QUOTA_EXHAUSTED");
        }
      }

      // If it's a different kind of error (e.g. 500 server error, malformed request), throw generic
      throw new Error("GENERIC_ERROR");
    }
  }

  private isAuthError(msg: string): boolean {
    return msg.includes("401") || msg.includes("403") || msg.includes("API key") || msg.includes("API_KEY");
  }

  private isQuotaError(msg: string): boolean {
    return msg.includes("429") || msg.includes("quota") || msg.includes("resource exhausted") || msg.includes("Too Many Requests");
  }
}