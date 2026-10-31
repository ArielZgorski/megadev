<script lang="ts">
  import { PROBLEMS } from '#lib/kb/problems';
  import { split } from '#lib/kb/ticket-split';

  // `filed`: problem → the ticket that now carries it.
  let { ticket, filed = {} }: { ticket: number; filed?: Record<string, { label: string; href: string }> } = $props();

  const s = $derived(split(ticket));
  const fmt = (n: Record<string, number>) =>
    Object.entries(n)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ×${v}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{s.merged.length}</strong> reports merged into #{ticket} ·
  <strong>{s.groups.length}</strong>
  {s.groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>came in by</th><th>intake tagged</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each s.groups as g (g.problem)}
      <tr>
        <td><code>{g.problem}</code><br /><span class="what">{PROBLEMS[g.problem].title}</span></td>
        <td><strong>{g.reports.length}</strong>{#if g.overlap}<br /><span class="small">{g.problem === 'shift' ? 'all filed under another problem too' : `incl. ${g.overlap} also in shift`}</span>{/if}</td>
        <td>{g.tenants.length}</td>
        <td class="small">{fmt(g.channels)}</td>
        <td class="small">{fmt(g.taggedAs)}</td>
        <td class="small">{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if filed[g.problem]}<a href={filed[g.problem].href}>{filed[g.problem].label}</a>{:else}—{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .what, .small { color: var(--muted); font-size: 0.85em; }
</style>
