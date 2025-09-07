import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGetMenuCategories } from "../endpoints/menu/categories_GET.schema";
import { postCreateMenuCategory } from "../endpoints/menu/category/create_POST.schema";
import { postUpdateMenuCategory } from "../endpoints/menu/category/update_POST.schema";
import { postDeleteMenuCategory } from "../endpoints/menu/category/delete_POST.schema";
import { postCreateMenuItem } from "../endpoints/menu/item/create_POST.schema";
import { postUpdateMenuItem } from "../endpoints/menu/item/update_POST.schema";
import { postDeleteMenuItem } from "../endpoints/menu/item/delete_POST.schema";

export const menuQueryKey = ["menu"];

export const useMenuQuery = () => {
  return useQuery({
    queryKey: menuQueryKey,
    queryFn: getGetMenuCategories,
  });
};

const invalidateMenuQuery = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: menuQueryKey });
};

// Category Mutations
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateMenuCategory,
    onSuccess: () => invalidateMenuQuery(queryClient),
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUpdateMenuCategory,
    onSuccess: () => invalidateMenuQuery(queryClient),
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDeleteMenuCategory,
    onSuccess: () => invalidateMenuQuery(queryClient),
  });
};

// Item Mutations
export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateMenuItem,
    onSuccess: () => invalidateMenuQuery(queryClient),
  });
};

export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUpdateMenuItem,
    onSuccess: () => invalidateMenuQuery(queryClient),
  });
};

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDeleteMenuItem,
    onSuccess: () => invalidateMenuQuery(queryClient),
  });
};