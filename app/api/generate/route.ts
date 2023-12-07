import { OpenAIStream, OpenAIStreamPayload } from "@/utils/openAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing environment variable from OpenAI");
}

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const payload: OpenAIStreamPayload = {
    model: "gpt-4",
    messages: [{ role: "user", content: `Always answer in markdown format and make the answer concise ${prompt}` }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  // Create a new response
  const response = new Response(stream);

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  // Return the response
  return response;
}
