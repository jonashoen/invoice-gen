import { cookies } from "next/headers";
import cookie from "cookie-signature";

import sessionConfig from "@/config/session";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import { Middleware } from "./withMiddleware";

const authenticate: Middleware<unknown> = async (req, next) => {
  const cookieStore = cookies();
  const sid = cookieStore.get(sessionConfig.cookieName);

  if (!sid) {
    return apiError(401);
  }

  const sessionId = cookie.unsign(sid.value, sessionConfig.signKey);

  if (!sessionId) {
    return apiError(401);
  }

  const userId = await user.checkSession({ sessionId });

  if (!userId) {
    return apiError(401);
  }

  req.user = userId;

  return next();
};

export default authenticate;
