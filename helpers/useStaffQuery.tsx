import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaffList } from '../endpoints/staff/list_GET.schema';
import { postCreateStaff, InputType as CreateStaffInput } from '../endpoints/staff/create_POST.schema';
import { postUpdateStaff, InputType as UpdateStaffInput } from '../endpoints/staff/update_POST.schema';
import { postDeleteStaff, InputType as DeleteStaffInput } from '../endpoints/staff/delete_POST.schema';
import { postCreateStaffAlt, InputType as CreateAltInput } from '../endpoints/staff/alts/create_POST.schema';
import { postUpdateStaffAlt, InputType as UpdateAltInput } from '../endpoints/staff/alts/update_POST.schema';
import { postDeleteStaffAlt, InputType as DeleteAltInput } from '../endpoints/staff/alts/delete_POST.schema';
import { supabase } from './supabase';
import { Database } from '../types/supabase';

export const STAFF_QUERY_KEY = ['staff', 'list'];

export const useStaffQuery = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data: staff, error } = await supabase
        .from('staff')
        .select(`
          *,
          staff_alts (*)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return {
        staff: staff.map(s => ({
          ...s,
          alts: s.staff_alts || []
        }))
      };
    },
  });
};

export const useCreateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Database['public']['Tables']['staff']['Insert']) => {
      const { data: result, error } = await supabase
        .from('staff')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Database['public']['Tables']['staff']['Update'] & { id: number }) => {
      const { data: result, error } = await supabase
        .from('staff')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

// Staff Alts Hooks
export const useCreateStaffAltMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Database['public']['Tables']['staff_alts']['Insert']) => {
      const { data: result, error } = await supabase
        .from('staff_alts')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useUpdateStaffAltMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Database['public']['Tables']['staff_alts']['Update'] & { id: number }) => {
      const { data: result, error } = await supabase
        .from('staff_alts')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useDeleteStaffAltMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase
        .from('staff_alts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};
