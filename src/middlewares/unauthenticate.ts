import { Middleware } from "./withMiddleware";
import isAuthed from "@/lib/isAuthed";
import { NextResponse } from "next/server";
import Pages from "@/routes/Pages";

const unauthenticate: Middleware<unknown, unknown> = async (_, next) => {
  const userId = await isAuthed();

  if (userId) {
    return NextResponse.redirect(Pages.Invoices);
  }

  return next();
};

export default unauthenticate;
