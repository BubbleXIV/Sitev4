import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGetPageContent,
  InputType as GetInput,
} from "../endpoints/page-content/get_GET.schema";
import {
  postUpdatePageContent,
  InputType as UpdateInput,
} from "../endpoints/page-content/update_POST.schema";

export const pageContentQueryKey = (pageSlug: string) => [
  "pageContent",
  pageSlug,
];

export const usePageContentQuery = (pageSlug: string) => {
  return useQuery({
    queryKey: pageContentQueryKey(pageSlug),
    queryFn: () => getGetPageContent({ pageSlug }),
    enabled: !!pageSlug,
  });
};

export const useUpdatePageContentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInput) => postUpdatePageContent(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: pageContentQueryKey(variables.pageSlug),
      });
    },
  });
};