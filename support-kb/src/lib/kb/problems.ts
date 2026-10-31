// Splits a merged ticket into the problems it really holds. Counts with the desk's view (causes.ts):
// every report stays under the cause it is filed under. Reports the desk read as a one-day move
// (desk-notes.json) are also their own problem, `shift`: a month-first parse swaps day and month;
// it cannot move a date by one day. So `shift` reports count twice: filed, and as what they are.
import { causeOf, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'shift' | 'unplaced';

export const PROBLEMS: Record<Problem, { title: string; what: string }> = {
  parser: {
    title: 'Shared parser reads day-first dates month first',
    what: 'Day and month swap: 7 April goes out as 4 July.',
  },
  hint: {
    title: 'booking-v3 form hints MM/DD/YYYY to day-first tenants',
    what: 'People type what the hint says, the form reads it day first, and day and month swap.',
  },
  shift: {
    title: 'Invites land one day off',
    what: 'The date moves by one day, not a swap; it differs by where the reader is (Lisbon vs Toronto).',
  },
  unplaced: {
    title: 'No tenant on file, or tenant writes month first',
    what: 'Cannot be placed from the tenant directory.',
  },
};

export function problemsOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem[] {
  const filed: Problem = causeOf(r, t) ?? 'unplaced';
  return oneDayMove.includes(r.id) ? [filed, 'shift'] : [filed];
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: string[];
  channels: Record<string, number>;
  taggedAs: Record<string, number>;
  firstSeen: string;
  lastSeen: string;
  // Of these, how many are also counted under another problem.
  overlap: number;
};

const tally = (xs: string[]) => xs.reduce<Record<string, number>>((n, x) => ({ ...n, [x]: (n[x] ?? 0) + 1 }), {});

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { merged: Report[]; groups: ProblemGroup[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const by = new Map<Problem, Report[]>();
  for (const r of merged) {
    for (const p of problemsOf(r, tenantOf(r), oneDayMove)) by.set(p, [...(by.get(p) ?? []), r]);
  }
  const groups = [...by.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
        channels: tally(rs.map((r) => r.channel)),
        taggedAs: tally(rs.map((r) => r.meta.intakeTag)),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
        overlap: problem === 'shift' ? rs.length : rs.filter((r) => oneDayMove.includes(r.id)).length,
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
  return { merged, groups };
}
