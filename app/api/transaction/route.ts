import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization");
  const res = await fetch(`${BACKEND_URL}/api/transaction`, {
    headers: { "Authorization": token || "" },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization");
  const body = await request.json();
  const res = await fetch(`${BACKEND_URL}/api/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token || "",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}