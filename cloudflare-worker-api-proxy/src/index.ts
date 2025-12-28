
export interface Env {
    API_KEY: string;
    ALLOWED_ORIGIN: string;
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const origin = request.headers.get("Origin") || "";
        const allowedOrigin = env.ALLOWED_ORIGIN || "https://asmithcodes.github.io";

        // Security: Validate Origin
        // Allow localhost for development
        const isAllowed = origin.includes(allowedOrigin) ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1");

        // 1. Handle CORS Preflight (OPTIONS)
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": origin, // Return the requesting origin if allowed
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Max-Age": "86400",
                },
            });
        }

        if (!isAllowed) {
            return new Response(`Forbidden: Invalid Origin. ${origin} is not allowed.`, { status: 403 });
        }

        // 2. Handle POST Request (Proxy to Gemini)
        if (request.method === "POST") {
            try {
                const { prompt, model } = await request.json() as any;
                const selectedModel = model || 'gemini-2.5-flash'; // Default model

                if (!prompt) {
                    return new Response("Missing prompt", { status: 400 });
                }

                const apiKey = env.API_KEY;
                if (!apiKey) {
                    return new Response("Server Configuration Error: API Key missing", { status: 500 });
                }

                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

                const apiResponse = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 2048,
                        }
                    }),
                });

                // Handle Quota errors explicitly
                if (apiResponse.status === 429) {
                    return new Response("QUOTA_EXHAUSTED", {
                        status: 429,
                        headers: { "Access-Control-Allow-Origin": origin }
                    });
                }

                const data = await apiResponse.json() as any;

                // Extract just the text to keep payload small
                let responseText = "";
                try {
                    responseText = data.candidates[0].content.parts[0].text;
                } catch (e) {
                    console.error("Error parsing Gemini response", data);
                    responseText = "Error processing response from AI.";
                    if (data.error) {
                        return new Response(JSON.stringify(data.error), {
                            status: 500,
                            headers: {
                                "Content-Type": "application/json",
                                "Access-Control-Allow-Origin": origin
                            }
                        });
                    }
                }

                return new Response(JSON.stringify({ text: responseText }), {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": origin,
                    },
                });

            } catch (error: any) {
                return new Response(JSON.stringify({ error: String(error) }), {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": origin,
                    },
                });
            }
        }

        return new Response("Method not allowed", { status: 405 });
    },
};
