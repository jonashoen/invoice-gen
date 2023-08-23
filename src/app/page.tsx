import isAuthed from "@/lib/isAuthed";
import Pages from "@/routes/Pages";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await isAuthed();

  if (!session) {
    redirect(Pages.Login);
  } else {
    redirect(Pages.Invoices);
  }
}
