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
    const next = () => {
      const middlewareOrHandler = middlewares.shift() ?? handler;

      return middlewareOrHandler(req, next);
    };

    return await next();
  };
};

export default withMiddleware;

export type { Middleware };
