import { NextResponse } from "next/server";

import sessionConfig from "@/config/session";

const createSession = (sessionId: string) => {
  const response = new NextResponse(null);

  response.cookies.set({
    name: sessionConfig.cookieName,
    value: sessionId,
    maxAge: sessionConfig.maxAge,
  });

  return response;
};

export default createSession;
