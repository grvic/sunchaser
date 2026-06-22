import { describe, expect, it } from 'vitest';

import { computeGoldenWindow, rankDestinations } from '@/lib/overlap';
import type {
  AvailabilityItem,
  DestinationItem,
  VoteItem,
} from '@/services/api';

const avail = (
  user_id: string,
  start: string,
  end: string
): AvailabilityItem => ({
  id: `${user_id}-${start}`,
  group_id: 'g1',
  user_id,
  displayName: user_id,
  startDate: new Date(start),
  endDate: new Date(end),
  createdAt: new Date(),
});

describe('computeGoldenWindow', () => {
  it('returns null with no availability', () => {
    expect(computeGoldenWindow([])).toBeNull();
  });

  it('finds the interval where the most members overlap', () => {
    const ranges = [
      avail('ana', '2026-07-01', '2026-07-15'),
      avail('luis', '2026-07-10', '2026-07-20'),
      avail('sara', '2026-07-12', '2026-07-13'),
    ];
    const golden = computeGoldenWindow(ranges);
    expect(golden).not.toBeNull();
    expect(golden!.total).toBe(3);
    expect(golden!.count).toBe(3); // 12–13 July all three overlap
    expect(golden!.start).toEqual(new Date(2026, 6, 12));
    expect(golden!.end).toEqual(new Date(2026, 6, 13));
  });
});

describe('rankDestinations', () => {
  const dest = (id: string): DestinationItem => ({
    id,
    group_id: 'g1',
    name: id,
    country: 'X',
    emoji: '🏖️',
    imageUrl: '',
    estimatedBudget: 100,
    lat: 0,
    lng: 0,
    suggestedStart: new Date(),
    suggestedEnd: new Date(),
    proposedBy: 'u',
    proposedByName: 'u',
    createdAt: new Date(),
  });

  const vote = (destination_id: string, user_id: string): VoteItem => ({
    id: `${destination_id}-${user_id}`,
    group_id: 'g1',
    destination_id,
    user_id,
    value: 1,
    createdAt: new Date(),
  });

  it('orders by vote count and flags my vote', () => {
    const destinations = [dest('a'), dest('b')];
    const votes = [vote('b', 'me'), vote('b', 'you'), vote('a', 'you')];
    const ranked = rankDestinations(destinations, votes, 'me');

    expect(ranked[0].destination.id).toBe('b');
    expect(ranked[0].votes).toBe(2);
    expect(ranked[0].votedByMe).toBe(true);
    expect(ranked[1].votes).toBe(1);
    expect(ranked[1].votedByMe).toBe(false);
  });
});
