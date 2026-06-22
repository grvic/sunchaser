import type { AvailabilityItem, DestinationItem, VoteItem } from '@/services/api';

/** Normalize to local midnight so comparisons are day-accurate. */
function atMidnight(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

const DAY = 24 * 60 * 60 * 1000;

export interface GoldenWindow {
  start: Date;
  end: Date;
  /** Distinct crew members free across the whole window. */
  count: number;
  /** Distinct crew members with any availability declared. */
  total: number;
}

/**
 * Sweep every declared availability range and find the longest date interval
 * where the largest number of distinct crew members are simultaneously free.
 */
export function computeGoldenWindow(
  ranges: AvailabilityItem[]
): GoldenWindow | null {
  if (ranges.length === 0) return null;

  const total = new Set(ranges.map((r) => r.user_id)).size;

  // Candidate boundaries: every start, and every (end + 1 day) as an open edge.
  const points = new Set<number>();
  for (const r of ranges) {
    points.add(atMidnight(r.startDate));
    points.add(atMidnight(r.endDate) + DAY);
  }
  const sorted = [...points].sort((a, b) => a - b);

  let best: GoldenWindow | null = null;

  for (let i = 0; i < sorted.length - 1; i++) {
    const segStart = sorted[i];
    const segEnd = sorted[i + 1] - DAY; // inclusive last day of the segment
    if (segEnd < segStart) continue;

    const users = new Set<string>();
    for (const r of ranges) {
      if (
        atMidnight(r.startDate) <= segStart &&
        atMidnight(r.endDate) >= segEnd
      ) {
        users.add(r.user_id);
      }
    }
    const count = users.size;
    if (count === 0) continue;

    if (
      best &&
      best.count === count &&
      atMidnight(best.end) + DAY === segStart
    ) {
      // Extend the previous winning window when it's adjacent with equal count.
      best.end = new Date(segEnd);
    } else if (!best || count > best.count) {
      best = { start: new Date(segStart), end: new Date(segEnd), count, total };
    }
  }

  return best;
}

export interface RankedDestination {
  destination: DestinationItem;
  votes: number;
  votedByMe: boolean;
}

/** Rank destinations by vote count (desc), then by recency. */
export function rankDestinations(
  destinations: DestinationItem[],
  votes: VoteItem[],
  myUserId: string
): RankedDestination[] {
  const byDestination = new Map<string, VoteItem[]>();
  for (const v of votes) {
    const list = byDestination.get(v.destination_id) ?? [];
    list.push(v);
    byDestination.set(v.destination_id, list);
  }

  return destinations
    .map((destination) => {
      const list = byDestination.get(destination.id) ?? [];
      return {
        destination,
        votes: list.length,
        votedByMe: list.some((v) => v.user_id === myUserId),
      };
    })
    .sort(
      (a, b) =>
        b.votes - a.votes ||
        b.destination.createdAt.getTime() - a.destination.createdAt.getTime()
    );
}

export function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const sameYear = start.getFullYear() === end.getFullYear();
  const startStr = start.toLocaleDateString('es-ES', opts);
  const endStr = end.toLocaleDateString('es-ES', { ...opts, year: 'numeric' });
  return sameYear
    ? `${startStr} – ${endStr}`
    : `${startStr} ${start.getFullYear()} – ${endStr}`;
}

export function formatBudget(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}
