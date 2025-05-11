// app/api/tick/route.ts
import { NextRequest, NextResponse } from 'next/server';

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

 // app/api/tick/route.ts
import { NextRequest, NextResponse } from 'next/server';

const KERNEL_URL = process.env.KERNEL_URL as string;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

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

  // 2) MentorBot via REST
  const llmRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      temperature: 0.4,
      messages: [
        { role: 'system',
          content: `You are MentorBot: a Socratic coach for venture decisions under uncertainty.` },
        { role: 'user',
          content: `State & action:\n${JSON.stringify(kernelData)}\nAction taken: ${body.action}` },
      ]
    })
  });
  if (!llmRes.ok) {
    console.error('OpenAI error', await llmRes.text());
    // fall back to empty mentor
    return NextResponse.json({ ...kernelData, mentor: '' });
  }
  const llmJson = await llmRes.json();
  const mentor = llmJson.choices?.[0]?.message?.content?.trim() ?? '';

  // 3) Return combined payload
  return NextResponse.json({ ...kernelData, mentor });
}
