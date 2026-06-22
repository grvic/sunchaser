import { formatBudget } from '@/lib/overlap';
import type { DestinationItem } from '@/services/api';

/**
 * Horizontal budget bars per destination, with dashed reference lines marking
 * the group's average and minimum budgets.
 */
export function BudgetChart({
  destinations,
}: {
  destinations: DestinationItem[];
}) {
  const withBudget = destinations.filter((d) => d.estimatedBudget > 0);
  if (withBudget.length === 0) return null;

  const values = withBudget.map((d) => d.estimatedBudget);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length);
  const pct = (v: number) => `${Math.round((v / max) * 100)}%`;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          💶 Presupuestos
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="inline-block h-2.5 w-3 border-b-2 border-dashed border-emerald-500" />
            Mín · {formatBudget(min)}
          </span>
          <span className="flex items-center gap-1 text-indigo-600">
            <span className="inline-block h-2.5 w-3 border-b-2 border-dashed border-indigo-500" />
            Media · {formatBudget(avg)}
          </span>
        </div>
      </div>

      <div className="relative space-y-2.5">
        {/* Reference lines spanning the bars area */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 border-l-2 border-dashed border-emerald-400/80"
          style={{ left: pct(min) }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 z-10 border-l-2 border-dashed border-indigo-400/80"
          style={{ left: pct(avg) }}
        />

        {withBudget
          .slice()
          .sort((a, b) => a.estimatedBudget - b.estimatedBudget)
          .map((d) => (
            <div key={d.id} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-xs font-medium text-gray-600">
                {d.emoji} {d.name}
              </span>
              <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-gray-100">
                <div
                  className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-sun-300 to-sun-500 pr-2"
                  style={{ width: pct(d.estimatedBudget) }}
                >
                  <span className="text-[11px] font-bold text-white drop-shadow">
                    {formatBudget(d.estimatedBudget)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
