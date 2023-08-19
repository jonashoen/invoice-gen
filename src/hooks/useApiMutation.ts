import { useMutation, useQueryClient } from "react-query";
import { ApiError, tryParseContent } from "./useApi";
import { Prefix } from "@/routes/Api";

interface Props<TResponse> {
  route: string;
  invalidates?: string[];
  onSuccess?: (data: TResponse) => void;
  onError?: (error: ApiError) => void;
}

const useApiMutation = <TRequest = any, TResponse = any>({
  route,
  invalidates,
  onSuccess,
  onError,
}: Props<TResponse>) => {
  const queryClient = useQueryClient();

  return useMutation(
    [route],
    async (body: TRequest) => {
      const request = await fetch(Prefix + route, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!request.ok) {
        throw new ApiError("Error while fetching the API", request.status);
      }

      return await tryParseContent(request);
    },
    {
      onSuccess: async (data) => {
        if (onSuccess) onSuccess(data);

        if (invalidates) {
          await Promise.all(
            invalidates.map((invalidator) =>
              queryClient.invalidateQueries(invalidator, { exact: true })
            )
          );
        }
      },
      onError,
    }
  );
};

export default useApiMutation;
