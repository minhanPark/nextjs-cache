import { getDBTime } from "./db-time";
import RevalidateButton from "./revalidate-button";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export default async function DBTime() {
  const { time } = await getDBTime();

  console.log(`Render /db-time ${new Date().toLocaleTimeString()}`);

  async function onRevalidate() {
    "use server";
    revalidateTag("db-time");
  }

  return (
    <div>
      <h1 className="text-2xl">Time From DB</h1>
      <p className="text-xl">{time}</p>
      <RevalidateButton onRevalidate={onRevalidate} />
    </div>
  );
}
