import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getListPages } from "../endpoints/pages/list_GET.schema";
import { postCreatePage } from "../endpoints/pages/create_POST.schema";
import { postUpdatePage } from "../endpoints/pages/update_POST.schema";
import { postDeletePage } from "../endpoints/pages/delete_POST.schema";

export const pagesQueryKey = ["pages"];

export const usePagesQuery = () => {
  return useQuery({
    queryKey: pagesQueryKey,
    queryFn: getListPages,
  });
};

const invalidatePagesQuery = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: pagesQueryKey });
};

export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreatePage,
    onSuccess: () => invalidatePagesQuery(queryClient),
  });
};

export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUpdatePage,
    onSuccess: () => invalidatePagesQuery(queryClient),
  });
};

export const useDeletePageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDeletePage,
    onSuccess: () => invalidatePagesQuery(queryClient),
  });
};