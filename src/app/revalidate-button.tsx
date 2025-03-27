"use client";

export default function RevalidateButton({
  onRevalidateHome,
}: {
  onRevalidateHome: () => Promise<void>;
}) {
  return (
    <button onClick={async () => await onRevalidateHome()} className="mt-4">
      Revalidate Home
    </button>
  );
}
