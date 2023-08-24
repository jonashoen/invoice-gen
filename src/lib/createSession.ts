import { NextResponse } from "next/server";
import cookie from "cookie-signature";

import sessionConfig from "@/config/session";

const createSession = (sessionId: string) => {
  const response = new NextResponse(null);

  response.cookies.set({
    name: sessionConfig.cookieName,
    value: cookie.sign(sessionId, sessionConfig.signKey),
    maxAge: sessionConfig.maxAge,
    secure: true,
    httpOnly: true,
  });

  return response;
};

export default createSession;
