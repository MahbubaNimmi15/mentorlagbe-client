
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      {
        success: false,
        message: "API_BASE_URL is not configured",
      },
      { status: 503 }
    );
  }

  try {
    const backendUrl = `${baseUrl.replace(/\/$/, "")}/api/health`;

    const response = await fetch(backendUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend health check failed",
          backendStatus: response.status,
        },
        { status: 502 }
      );
    }

    const backend = await response.json();

    return NextResponse.json({
      success: true,
      message: "Frontend can reach Backend API",
      backend,
    });
  } catch (error) {
    console.error("Backend connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Backend API is unreachable",
      },
      { status: 502 }
    );
  }
}
