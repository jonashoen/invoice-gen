import { cookies } from "next/headers";

import sessionConfig from "@/config/session";

const isAuthed = () => {
  const cookieStore = cookies();
  const sid = cookieStore.get(sessionConfig.cookieName);

  if (!sid) {
    return false;
  }

  return true;
};

export default isAuthed;
