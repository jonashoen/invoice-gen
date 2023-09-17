"use server";

import { NextResponse } from "next/server";

import customer from "@/services/customer";
import withMiddleware from "@/middlewares/withMiddleware";
import authenticate from "@/middlewares/authenticate";
import RequestHandler from "@/interfaces/requests/RequestHandler";

const handler: RequestHandler = async (req) => {
  const userId = req.user!;

  const customers = await customer.getCustomers(userId);

  return NextResponse.json(customers);
};

const GET = withMiddleware([authenticate], handler);

export { GET };
