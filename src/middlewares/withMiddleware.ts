import BaseRequest from "@/interfaces/requests/BaseRequest";
import RequestHandler from "@/interfaces/requests/RequestHandler";

type Middleware<T> = (
  req: BaseRequest<T>,
  next: () => Promise<Response>
) => Promise<Response>;

const withMiddleware = <TBody = unknown, TParams = unknown>(
  middlewares: Middleware<TBody>[],
  handler: RequestHandler<TBody, TParams>
) => {
  return async (req: BaseRequest<TBody>, params: { params: TParams }) => {
    let currentMiddlewareIndex = 0;

    const next = () => {
      const middleware = middlewares[currentMiddlewareIndex++];

      if (middleware) {
        return middleware(req, next);
      }

      return handler(req, params);
    };

    return await next();
  };
};

export default withMiddleware;

export type { Middleware };
