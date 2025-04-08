"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePage() {
  revalidatePath("/router-cache");
}
