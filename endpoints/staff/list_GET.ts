import { db } from "../../helpers/db";
import { OutputType } from "./list_GET.schema";
import superjson from 'superjson';

export async function handle(request: Request) {
  try {
    const staff = await db.selectFrom('staff')
      .selectAll()
      .orderBy('displayOrder', 'asc')
      .orderBy('createdAt', 'asc')
      .execute();

    const staffAlts = await db.selectFrom('staffAlts')
      .selectAll()
      .orderBy('displayOrder', 'asc')
      .orderBy('createdAt', 'asc')
      .execute();

    const altsByStaffId = staffAlts.reduce((acc, alt) => {
      if (!acc[alt.staffId]) {
        acc[alt.staffId] = [];
      }
      acc[alt.staffId].push(alt);
      return acc;
    }, {} as Record<number, typeof staffAlts>);

    const staffWithAlts = staff.map(s => ({
      ...s,
      alts: altsByStaffId[s.id] || [],
    }));

    return new Response(superjson.stringify({ staff: staffWithAlts } satisfies OutputType));
  } catch (error) {
    console.error("Error fetching staff list:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(superjson.stringify({ error: errorMessage }), { status: 500 });
  }
}