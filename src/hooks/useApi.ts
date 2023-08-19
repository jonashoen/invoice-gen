import { useQuery } from "react-query";
import { Prefix } from "@/routes/Api";

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
  onSuccess,
  onError,
  initialData,
  enabled,
}: Props<TResponse>) => {
  const query = useQuery<any, ApiError, TResponse>(
    [route],
    async () => {
      const response = await fetch(Prefix + route, {
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

  return { ...query, data: query.data as TResponse, invalidator: [route] };
};

export default useApi;
export { ApiError, tryParseContent };

const tryParseContent = async (request: Response) => {
  const data = await request.text();

  try {
    return await JSON.parse(data);
  } catch {
    return data;
  }
};
