import { z } from "zod";
import superjson from 'superjson';

export const schema = z.object({});

export type SiteSettingsMap = Record<string, string | null>;

export type OutputType = {
  settings: SiteSettingsMap;
};

export const getSiteSettings = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/_api/site-settings/get`, {
    method: "GET",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!result.ok) {
    const errorObject = superjson.parse(await result.text());
    throw new Error((errorObject as any).error);
  }
  return superjson.parse<OutputType>(await result.text());
};