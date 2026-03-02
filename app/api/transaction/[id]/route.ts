import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization");
  const { id } = params;

  const res = await fetch(`${BACKEND_URL}/api/transaction/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": token || "",
    },
  });

  if (res.ok) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json({ error: "Erro ao deletar" }, { status: res.status });
}