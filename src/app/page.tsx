import { connection } from "next/server";

export default async function Home() {
  await connection();
  console.log(`Rendering  ${new Date().toLocaleTimeString()}`);
  return (
    <main>
      <div className="">{new Date().toLocaleTimeString()}</div>
    </main>
  );
}
