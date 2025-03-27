//import { connection } from "next/server";
//import { headers } from "next/headers";
//import { useSearchParams } from "next/navigation";

//export const dynamic = "force-dynamic";

// export const revalidate = 5;
import { revalidatePath } from "next/cache";
import RevalidateButton from "./revalidate-button";

export default async function Home() {
  //await connection();
  //await headers();
  //useSearchParams();
  async function onRevalidateHome() {
    "use server";
    revalidatePath("/");
  }

  console.log(`Rendering  ${new Date().toLocaleTimeString()}`);
  return (
    <main>
      <div className="">{new Date().toLocaleTimeString()}</div>
      <RevalidateButton onRevalidateHome={onRevalidateHome} />
    </main>
  );
}
