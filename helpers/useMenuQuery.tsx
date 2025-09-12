import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGetMenuCategories } from "../endpoints/menu/categories_GET.schema";
import { postCreateMenuCategory } from "../endpoints/menu/category/create_POST.schema";
import { postUpdateMenuCategory } from "../endpoints/menu/category/update_POST.schema";
import { postDeleteMenuCategory } from "../endpoints/menu/category/delete_POST.schema";
import { postCreateMenuItem } from "../endpoints/menu/item/create_POST.schema";
import { postUpdateMenuItem } from "../endpoints/menu/item/update_POST.schema";
import { postDeleteMenuItem } from "../endpoints/menu/item/delete_POST.schema";

export const menuQueryKey = ["menu"];
export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Database['public']['Tables']['menu_items']['Insert']) => {
      const { data: result, error } = await supabase
        .from('menu_items')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
};

export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Database['public']['Tables']['menu_items']['Update'] & { id: number }) => {
      const { data: result, error } = await supabase
        .from('menu_items')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
};

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });
};
