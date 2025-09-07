import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSiteSettings } from '../endpoints/site-settings/get_GET.schema';
import { postUpdateSiteSettings, InputType as UpdateSettingsInput } from '../endpoints/site-settings/update_POST.schema';

export const SITE_SETTINGS_QUERY_KEY = ['siteSettings'];

export const useSiteSettingsQuery = () => {
  return useQuery({
    queryKey: SITE_SETTINGS_QUERY_KEY,
    queryFn: () => getSiteSettings(),
  });
};

export const useUpdateSiteSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: UpdateSettingsInput) => postUpdateSiteSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_SETTINGS_QUERY_KEY });
    },
  });
};