import { NextResponse } from "next/server";

import sessionConfig from "@/config/session";

const destroySession = () => {
  const response = new NextResponse(null);

  response.cookies.set({
    name: sessionConfig.cookieName,
    value: "",
    maxAge: -1,
  });

  return response;
};

export default destroySession;
