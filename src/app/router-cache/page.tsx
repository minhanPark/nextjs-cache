//import Link from "next/link";
import Link from "next/link";
//import Timer from "./sub-route/timer";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <main>
      <div className="">Time: {new Date().toLocaleTimeString()}</div>
      <div className="">
        <Link href="/router-cache/sub-route">Sub-Route</Link>

        {/* <Timer /> */}
      </div>
    </main>
  );
}
