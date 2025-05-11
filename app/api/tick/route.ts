// app/api/tick/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();  // uses OPENAI_API_KEY from Vercel env
const KERNEL_URL = process.env.KERNEL_URL as string;

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 1) Kernel call
  const kernelRes = await fetch(KERNEL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!kernelRes.ok) {
    return NextResponse.json({ error: 'Kernel call failed' }, { status: 500 });
  }
  const kernelData = await kernelRes.json();

  // 2) MentorBot LLM call
  const mentorRes = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 200,
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content: `You are MentorBot: a Socratic coach for venture decisions under uncertainty.`
      },
      {
        role: 'user',
        content: `State & action:\n${JSON.stringify(kernelData)}\nAction taken: ${body.action}`
      }
    ]
  });
  const mentorMsg = mentorRes.choices?.[0]?.message?.content ?? '';

  // 3) Return combined payload
  return NextResponse.json({
    ...kernelData,
    mentor: mentorMsg.trim()
  });
}
