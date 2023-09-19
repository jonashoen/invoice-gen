import isAuthed from "@/lib/isAuthed";
import Pages from "@/routes/Pages";
import { redirect } from "next/navigation";

const Home = async () => {
  const session = await isAuthed();

  if (!session) {
    redirect(Pages.Login);
  } else {
    redirect(Pages.Invoices);
  }
};

export default Home;
