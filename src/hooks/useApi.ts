import { useQuery } from "react-query";
import { StatusCodes } from "http-status-codes";
import { prefix } from "@/routes/Api";

class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

interface Props<TResponse> {
  route: string;
  query?: { [key: string]: any };
  onSuccess?: (data: TResponse) => void;
  onError?: (error: ApiError) => void;
  initialData?: TResponse;
  enabled?: boolean;
}

const useApi = <TResponse>({
  route,
  query: queryObject,
  onSuccess,
  onError,
  initialData,
  enabled,
}: Props<TResponse>) => {
  const processedRoute = routeBuilder({ route, query: queryObject });

  const query = useQuery(
    [route],
    async () => {
      const response = await fetch(processedRoute, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new ApiError("Error while fetching the API", response.status);
      }

      return await tryParseContent(response);
    },
    {
      onSuccess,
      onError,
      initialData,
      enabled,
    }
  );

  return { ...query, invalidator: [route] };
};

const routeBuilder = ({
  route,
  query: queryObject,
}: {
  route: string;
  query?: { [key: string]: any };
}) => {
  const params: { [key: string]: any } = {};

  if (queryObject) {
    for (const key of Object.keys(queryObject)) {
      if (queryObject[key] !== undefined) {
        params[key] = queryObject[key];
      }
    }
  }

  const queryParams = new URLSearchParams(params);

  return prefix + route + (queryObject ? `?${queryParams.toString()}` : "");
};

export default useApi;
export { ApiError, tryParseContent, routeBuilder };

const tryParseContent = async (request: Response) => {
  const data = await request.text();

  try {
    return await JSON.parse(data);
  } catch {
    return data;
  }
};
