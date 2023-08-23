import { cookies } from "next/headers";

import sessionConfig from "@/config/session";
import user from "@/services/user";

const isAuthed = async () => {
  const cookieStore = cookies();
  const sid = cookieStore.get(sessionConfig.cookieName);

  if (!sid) {
    return false;
  }

  return await user.checkSession({ sessionId: sid.value });
};

export default isAuthed;
