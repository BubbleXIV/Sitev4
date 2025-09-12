import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSiteSettings } from '../endpoints/site-settings/get_GET.schema';
import { postUpdateSiteSettings, InputType as UpdateSettingsInput } from '../endpoints/site-settings/update_POST.schema';

export const SITE_SETTINGS_QUERY_KEY = ['siteSettings'];

export const useSiteSettingsQuery = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data: settings, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;
      
      // Convert to key-value object
      const settingsMap: Record<string, string | null> = {};
      settings.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });
      
      return { settings: settingsMap };
    },
  });
};

export const useUpdateSiteSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      const promises = Object.entries(settings).map(([key, value]) =>
        supabase
          .from('site_settings')
          .upsert({ key, value })
          .select()
      );

      const results = await Promise.all(promises);
      
      // Check for errors
      results.forEach(result => {
        if (result.error) throw result.error;
      });

      return results.map(r => r.data).flat();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
  });
};
