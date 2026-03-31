import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { idea, customer, problem } = await req.json();

    if (!idea?.trim() || !customer?.trim()) {
      return NextResponse.json(
        { lines: ["Please fill in required fields."] },
        { status: 400 }
      );
    }

    const prompt = `
Generate 3 short startup one-liners.

Startup: ${idea}
Customer: ${customer}
Problem: ${problem || ""}

Return JSON:
{"lines":["...","...","..."]}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 80,
    });

    const text =
      completion.choices[0]?.message?.content ||
      '{"lines":["No result generated"]}';

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        lines: [
          "We help customers solve a problem more efficiently.",
          "A simple product built for a specific user group.",
          "A platform designed to improve how work gets done.",
        ],
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      lines: ["Something went wrong. Please try again."],
    });
  }
}
