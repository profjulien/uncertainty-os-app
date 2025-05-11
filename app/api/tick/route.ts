import { NextRequest, NextResponse } from 'next/server';

const KERNEL_URL = process.env.KERNEL_URL as string;

export async function POST(req: NextRequest) {
  const body = await req.json();

  const kernel = await fetch(KERNEL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!kernel.ok) {
    return NextResponse.json({ error: 'Kernel call failed' }, { status: 500 });
  }

  const data = await kernel.json();
  return NextResponse.json(data);
}
