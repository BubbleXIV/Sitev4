import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from './supabase';
import { Database } from '../types/supabase';
import {
  getGetPageContent,
  InputType as GetInput,
} from "../endpoints/page-content/get_GET.schema";
import {
  postUpdatePageContent,
  InputType as UpdateInput,
} from "../endpoints/page-content/update_POST.schema";

export const usePageContentQuery = (pageSlug: string) => {
  return useQuery({
    queryKey: ['pageContent', pageSlug],
    queryFn: async () => {
      const { data: pageContent, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { pageContent };
    },
    enabled: !!pageSlug,
  });
};

export const useUpdatePageContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pageSlug, content }: { 
      pageSlug: string; 
      content: Array<{
        sectionKey: string;
        contentType: string;
        content: string;
        displayOrder: number;
      }> 
    }) => {
      await supabase
        .from('page_content')
        .delete()
        .eq('page_slug', pageSlug);

      const insertData = content.map(item => ({
        page_slug: pageSlug,
        section_key: item.sectionKey,
        content_type: item.contentType,
        content: item.content,
        display_order: item.displayOrder
      }));

      const { data, error } = await supabase
        .from('page_content')
        .insert(insertData)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pageContent', variables.pageSlug] });
    },
  });
};
