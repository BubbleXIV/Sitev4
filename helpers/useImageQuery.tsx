import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getListImages } from "../endpoints/images/list_GET.schema";
import { postUploadImage } from "../endpoints/images/upload_POST.schema";
import { postDeleteImage } from "../endpoints/images/delete_POST.schema";

export const imagesQueryKey = ["images"];

export const useImagesQuery = () => {
  return useQuery({
    queryKey: imagesQueryKey,
    queryFn: getListImages,
  });
};

const invalidateImagesQuery = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: imagesQueryKey });
};

export const useUploadImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => postUploadImage(formData),
    onSuccess: () => invalidateImagesQuery(queryClient),
  });
};

export const useDeleteImageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDeleteImage,
    onSuccess: () => invalidateImagesQuery(queryClient),
  });
};