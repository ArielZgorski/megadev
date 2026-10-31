<script lang="ts">
  import type { Problem } from '#lib/kb/problems';
  import { split } from '#lib/kb/ticket-split';

  // The reports behind one problem, quoted as filed. `limit` keeps big groups short.
  let { ticket, problem, limit = Infinity }: { ticket: number; problem: Problem; limit?: number } = $props();

  const g = $derived(split(ticket).groups.find((x) => x.problem === problem));
  const shown = $derived(g ? g.reports.slice(0, limit) : []);
</script>

<ul>
  {#each shown as r (r.id)}
    <li><code>{r.id}</code> · {r.tenant} · {r.channel} · {r.receivedAt.slice(0, 10)}: “{r.body}”</li>
  {/each}
</ul>
{#if g && g.reports.length > shown.length}
  <p class="more">and {g.reports.length - shown.length} more.</p>
{/if}

<style>
  li { margin: 0.3rem 0; font-size: 0.92rem; }
  .more { color: var(--muted); font-size: 0.85rem; }
</style>
