"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

//import { revalidatePage } from "../revalidate-page";

export default function SubRoute() {
  const router = useRouter();

  return (
    <main className="flex flex-col gap-3">
      <Link href="/router-cache">Home</Link>
      <div className="">
        <button
          onClick={async () => {
            // await fetch("/router-cache/sub-route/revalidate", {
            //   method: "POST",
            // });
            //await revalidatePage();
            router.push("/router-cache");
            //router.refresh();
          }}
        >
          Bust the Cache
        </button>
      </div>
    </main>
  );
}
