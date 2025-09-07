import { z } from "zod";
import superjson from 'superjson';
import { Selectable } from "kysely";
import { Staff, StaffAlts } from "../../helpers/schema";

export const schema = z.object({});

export type StaffWithAlts = Selectable<Staff> & {
  alts: Selectable<StaffAlts>[];
};

export type OutputType = {
  staff: StaffWithAlts[];
};

export const getStaffList = async (init?: RequestInit): Promise<OutputType> => {
  const result = await fetch(`/_api/staff/list`, {
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