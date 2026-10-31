<script lang="ts">
  import type { Problem } from '#lib/kb/problems';
  import { split } from '#lib/kb/ticket-split';

  // Inline count for prose. No `problem`: every report merged into the ticket.
  // `of: 'problems'` counts the problems instead; `of: 'tenants'` the tenants behind one problem.
  let { ticket, problem, of = 'reports' }: { ticket: number; problem?: Problem; of?: 'reports' | 'tenants' | 'problems' } = $props();

  const n = $derived.by(() => {
    const s = split(ticket);
    if (of === 'problems') return s.groups.length;
    if (!problem) return s.merged.length;
    const g = s.groups.find((x) => x.problem === problem);
    return g ? (of === 'tenants' ? g.tenants.length : g.reports.length) : 0;
  });
</script>

<strong>{n}</strong>
