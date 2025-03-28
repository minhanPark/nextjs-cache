import { NextResponse } from "next/server";

export async function GET() {
  console.log(`GET /time ${new Date().toLocaleTimeString()}`);
  return NextResponse.json({ time: new Date().toLocaleTimeString() });
}
