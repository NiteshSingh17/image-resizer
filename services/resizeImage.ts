import { useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { API_URIS, apiClient, AxiosError } from ".";
import { ResizeImageResponse } from "@/app/api/resize/route";


export const useResizeImage = (
  config: UseMutationOptions<
    ResizeImageResponse,
    AxiosError,  
    FormData
  >,
): UseMutationResult<
  ResizeImageResponse,
  AxiosError,
  FormData
> => {
  return useMutation({
    ...config,
    mutationFn: async (data) => {
      const res = await apiClient.post<ResizeImageResponse>(
        API_URIS.resizeImage,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );
      if (res.ok && res.data) {
        return res.data;
      } else {
        throw res.originalError;
      }
    },
  });
};