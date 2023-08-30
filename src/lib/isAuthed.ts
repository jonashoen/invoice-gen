import { cookies } from "next/headers";
import cookie from "cookie-signature";

import sessionConfig from "@/config/session";
import user from "@/services/user";

const isAuthed = async () => {
  const cookieStore = cookies();
  const sid = cookieStore.get(sessionConfig.cookieName);

  if (!sid) {
    return null;
  }

  const sessionId = cookie.unsign(sid.value, sessionConfig.signKey);

  if (!sessionId) {
    return null;
  }

  return await user.checkSession({ sessionId });
};

export default isAuthed;
