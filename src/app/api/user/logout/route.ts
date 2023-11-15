import destroySession from "@/lib/destroySession";
import user from "@/services/user";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import AuthedRequestHandler from "@/interfaces/requests/AuthedRequestHandler";

const handler: AuthedRequestHandler = async (req) => {
  const userId = req.user;

  await user.logout(userId);

  return destroySession();
};

const POST = withMiddleware([authenticate], handler);

export { POST };
