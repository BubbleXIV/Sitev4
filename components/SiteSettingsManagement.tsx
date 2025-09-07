import React from 'react';
import { z } from 'zod';
import { useForm, Form, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Input } from './Input';
import { Button } from './Button';
import { useUpdateSiteSettingsMutation } from '../helpers/useSiteSettingsQuery';
import { SiteSettingsMap } from '../endpoints/site-settings/get_GET.schema';
import styles from './SiteSettingsManagement.module.css';

const settingsSchema = z.object({
  logoUrl: z.string().url("Must be a valid URL for the logo").or(z.literal("")).optional(),
  blueskyUrl: z.string().url("Must be a valid URL for Bluesky").or(z.literal("")).optional(),
  discordUrl: z.string().url("Must be a valid URL for Discord").or(z.literal("")).optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export const SiteSettingsManagement: React.FC<{ settings: SiteSettingsMap }> = ({ settings }) => {
  const updateSettingsMutation = useUpdateSiteSettingsMutation();

  const form = useForm({
    schema: settingsSchema,
    defaultValues: {
      logoUrl: settings.logoUrl ?? '',
      blueskyUrl: settings.blueskyUrl ?? '',
      discordUrl: settings.discordUrl ?? '',
    },
  });

  const handleSubmit = async (values: SettingsFormValues) => {
    try {
      await updateSettingsMutation.mutateAsync(values);
      // Optionally show a success toast here
      console.log("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update settings:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      form.setFieldError('logoUrl', `Update failed: ${errorMessage}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <FormItem name="logoUrl">
          <FormLabel>Logo URL</FormLabel>
          <FormControl>
            <Input
              placeholder="https://example.com/logo.png"
              value={form.values.logoUrl ?? ''}
              onChange={(e) => form.setValues(prev => ({ ...prev, logoUrl: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem name="blueskyUrl">
          <FormLabel>Bluesky Profile URL</FormLabel>
          <FormControl>
            <Input
              placeholder="https://bsky.app/profile/..."
              value={form.values.blueskyUrl ?? ''}
              onChange={(e) => form.setValues(prev => ({ ...prev, blueskyUrl: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem name="discordUrl">
          <FormLabel>Discord Invite URL</FormLabel>
          <FormControl>
            <Input
              placeholder="https://discord.gg/..."
              value={form.values.discordUrl ?? ''}
              onChange={(e) => form.setValues(prev => ({ ...prev, discordUrl: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <div className={styles.footer}>
          <Button type="submit" disabled={updateSettingsMutation.isPending}>
            {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
};