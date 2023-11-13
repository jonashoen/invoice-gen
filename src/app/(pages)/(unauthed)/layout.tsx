import Container from "@/components/Container";
import isAuthed from "@/lib/isAuthed";
import Pages from "@/routes/Pages";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const authed = await isAuthed();

  if (authed) {
    redirect(Pages.Invoices);
  }

  return (
    <main className="mx-auto min-h-screen flex flex-col justify-center">
      <div className="container flex flex-col mx-auto gap-20">
        <Container className="bg-green mt-20 w-fit">
          <p className="font-bold py-4 text-6xl">invoice-gen</p>
        </Container>
        {children}
      </div>
    </main>
  );
};

export default Layout;
