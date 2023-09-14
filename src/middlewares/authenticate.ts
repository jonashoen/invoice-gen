import { cookies } from "next/headers";
import cookie from "cookie-signature";

import sessionConfig from "@/config/session";
import user from "@/services/user";
import apiError from "@/lib/apiError";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const authenticate = (handler: RequestHandler): RequestHandler => {
  return async (req, res) => {
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

    return handler(req, res);
  };
};

export default authenticate;
