import { NextRequest } from "next/server";

interface BaseRequest<T> extends NextRequest {
  json: () => Promise<T>;
}

export default BaseRequest;
