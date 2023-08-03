import isAuthed from "@/lib/isAuthed";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Home() {
  if (!isAuthed()) {
    return redirect("/login");
  }

  return (
    <main>
      <Link href="/login">Login</Link>
    </main>
  );
}
