import { NextResponse } from "next/server";

import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";

const handler = async () => {
  return new NextResponse();
};

const GET = withMiddleware([authenticate], handler);

export { GET };
