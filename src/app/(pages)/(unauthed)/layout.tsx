import Chip from "@/components/Chip";
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
        <Container className="mt-20 !border-0 !p-0 flex">
          <Chip
            className="bg-orange -rotate-3"
            style={{ borderRadius: "48px" }}
          >
            <h1 className="font-bold text-5xl text-white">invoice-gen</h1>
          </Chip>
        </Container>
        {children}
      </div>
    </main>
  );
};

export default Layout;
