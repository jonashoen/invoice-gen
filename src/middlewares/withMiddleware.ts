import BaseRequest from "@/interfaces/requests/BaseRequest";
import RequestHandler from "@/interfaces/requests/RequestHandler";

type Middleware<T> = (
  req: BaseRequest<T>,
  next: () => Promise<Response>
) => Promise<Response>;

const withMiddleware = <T = unknown>(
  middlewares: Middleware<T>[],
  handler: RequestHandler<T>
) => {
  return async (req: BaseRequest<T>) => {
    let middlewareIndex = 0;

    const next = () => {
      const middleware = middlewares[middlewareIndex++] ?? handler;

      return middleware(req, next);
    };

    return await next();
  };
};

export default withMiddleware;

export type { Middleware };
