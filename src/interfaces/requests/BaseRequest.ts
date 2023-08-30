import { NextRequest } from "next/server";
import { ObjectSchema } from "joi";
import isAuthed from "@/lib/isAuthed";

class BaseRequest<T = unknown> extends NextRequest {
  constructor(input: URL | RequestInfo, init?: RequestInit | undefined) {
    super(input, init);
  }

  session() {
    return isAuthed();
  }

  async parse(schema: ObjectSchema) {
    const body = await super.json();

    const validationResult = schema.validate(body);

    if (validationResult.error) {
      return null;
    }

    return validationResult.value as T;
  }
}

export default BaseRequest;
