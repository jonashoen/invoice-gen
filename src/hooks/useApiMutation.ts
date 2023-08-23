import { useMutation, useQueryClient } from "react-query";
import { ApiError, tryParseContent } from "./useApi";
import { Prefix } from "@/routes/Api";
import { StatusCodes } from "http-status-codes";
import useUserStore from "@/store/userStore";

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

  const [isAuthed, logout] = useUserStore((state) => [
    state.isAuthed,
    state.logout,
  ]);

  return useMutation(
    [route],
    async (body: TRequest) => {
      const response = await fetch(Prefix + route, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === StatusCodes.UNAUTHORIZED && isAuthed) {
          logout();
        }

        throw new ApiError("Error while fetching the API", response.status);
      }

      return await tryParseContent(response);
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
