"use server";

import destroySession from "@/lib/destroySession";
import user from "@/services/user";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler = async (req) => {
  const userId = req.user!;

  await user.logout(userId);

  return destroySession();
};

const POST = withMiddleware([authenticate], handler);

export { POST };
