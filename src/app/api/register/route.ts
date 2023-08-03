import { NextResponse } from "next/server";

import BaseRequest from "@/interfaces/requests/BaseRequest";
import RegisterRequest from "@/interfaces/requests/register";
import isAuthed from "@/lib/isAuthed";

const POST = async (request: BaseRequest<RegisterRequest>) => {
  if (isAuthed()) {
    return NextResponse.redirect("/");
  }

  const body = await request.json();

  console.log({ body });

  return NextResponse.json({});
};

export { POST };
