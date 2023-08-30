// interface IBaseRequest<T> extends NextRequest {
//   session: () => Promise<number | null>;
//   parse: (schema: ObjectSchema) => Promise<T | null>;
// }

declare module "next" {
  export interface NextRequest extends Request {
    user: {
      id: string;
    };
  }
}
