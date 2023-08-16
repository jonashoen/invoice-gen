import isAuthed from "@/lib/isAuthed";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await isAuthed();

  if (!session) {
    redirect("/login");
  } else {
    redirect("/dashboard");
  }
}
