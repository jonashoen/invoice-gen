import { NextResponse } from "next/server";

import user from "@/services/user";
import { RequestResetPasswordRequest } from "@/interfaces/requests/user";
import userSchemas from "@/schemas/user";
import withMiddleware from "@/middlewares/withMiddleware";
import unauthenticate from "@/middlewares/unauthenticate";
import validateBody from "@/middlewares/validateBody";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler<RequestResetPasswordRequest> = async (req) => {
  const payload = req.data!;

  user.requestResetPassword(payload);

  return new NextResponse();
};

const POST = withMiddleware(
  [unauthenticate, validateBody(userSchemas.requestResetPassword)],
  handler
);

export { POST };
