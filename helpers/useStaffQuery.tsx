import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaffList } from '../endpoints/staff/list_GET.schema';
import { postCreateStaff, InputType as CreateStaffInput } from '../endpoints/staff/create_POST.schema';
import { postUpdateStaff, InputType as UpdateStaffInput } from '../endpoints/staff/update_POST.schema';
import { postDeleteStaff, InputType as DeleteStaffInput } from '../endpoints/staff/delete_POST.schema';
import { postCreateStaffAlt, InputType as CreateAltInput } from '../endpoints/staff/alts/create_POST.schema';
import { postUpdateStaffAlt, InputType as UpdateAltInput } from '../endpoints/staff/alts/update_POST.schema';
import { postDeleteStaffAlt, InputType as DeleteAltInput } from '../endpoints/staff/alts/delete_POST.schema';

export const STAFF_QUERY_KEY = ['staff', 'list'];

export const useStaffListQuery = () => {
  return useQuery({
    queryKey: STAFF_QUERY_KEY,
    queryFn: () => getStaffList(),
  });
};

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newStaff: CreateStaffInput) => postCreateStaff(newStaff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedStaff: UpdateStaffInput) => postUpdateStaff(updatedStaff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
  });
};

export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (staffToDelete: DeleteStaffInput) => postDeleteStaff(staffToDelete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
  });
};

export const useCreateStaffAltMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAlt: CreateAltInput) => postCreateStaffAlt(newAlt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
  });
};

export const useUpdateStaffAltMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedAlt: UpdateAltInput) => postUpdateStaffAlt(updatedAlt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
  });
};

export const useDeleteStaffAltMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (altToDelete: DeleteAltInput) => postDeleteStaffAlt(altToDelete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
  });
};