"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Timer() {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
    });

    return () => {
      clearInterval(timer);
    };
  }, [router]);

  return null;
}
