import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getListAdminUsers } from "../endpoints/admin-users/list_GET.schema";
import { postCreateAdminUser } from "../endpoints/admin-users/create_POST.schema";
import { postUpdateAdminUser } from "../endpoints/admin-users/update_POST.schema";
import { postDeleteAdminUser } from "../endpoints/admin-users/delete_POST.schema";

export const adminUsersQueryKey = ["adminUsers"];

export const useAdminUsersQuery = () => {
  return useQuery({
    queryKey: adminUsersQueryKey,
    queryFn: getListAdminUsers,
  });
};

const invalidateAdminUsersQuery = (queryClient: any) => {
  queryClient.invalidateQueries({ queryKey: adminUsersQueryKey });
};

export const useCreateAdminUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateAdminUser,
    onSuccess: () => invalidateAdminUsersQuery(queryClient),
  });
};

export const useUpdateAdminUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUpdateAdminUser,
    onSuccess: () => invalidateAdminUsersQuery(queryClient),
  });
};

export const useDeleteAdminUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postDeleteAdminUser,
    onSuccess: () => invalidateAdminUsersQuery(queryClient),
  });
};