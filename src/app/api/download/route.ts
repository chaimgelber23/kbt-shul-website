import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const title = request.nextUrl.searchParams.get("title") || "shiur";

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Only allow downloading from approved audio sources
  try {
    const parsed = new URL(url);
    const allowed =
      parsed.hostname.endsWith("jewishpodcasts.fm") ||
      parsed.hostname === "storage.googleapis.com";
    if (!allowed) {
      return NextResponse.json({ error: "Invalid audio source" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch audio" }, { status: 502 });
    }

    const contentType = res.headers.get("content-type") || "audio/mpeg";
    const contentLength = res.headers.get("content-length");

    // Sanitize filename
    const safeName = title.replace(/[^a-zA-Z0-9 _\-().]/g, "").trim() || "shiur";

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeName}.mp3"`,
    };
    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    return new NextResponse(res.body, { status: 200, headers });
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
