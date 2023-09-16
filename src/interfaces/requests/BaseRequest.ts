import { NextRequest } from "next/server";

interface BaseRequest<T> extends NextRequest {
  json: () => Promise<T>;

  user?: number;
  data?: T;
}

export default BaseRequest;
