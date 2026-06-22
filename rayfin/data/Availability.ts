import { entity, authenticated, uuid, text, date } from '@microsoft/rayfin-core';

/**
 * A date range a crew member is free to travel, scoped to a {@link TripGroup}.
 * The dashboard overlaps everyone's ranges to find the "golden window". Reads
 * are shared; each user edits only their own ranges (RLS on `user_id`).
 */
@entity()
@authenticated('read')
@authenticated('create', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('update', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('delete', { policy: (claims, item) => claims.sub.eq(item.user_id) })
export class Availability {
  @uuid() id!: string;
  @uuid() group_id!: string;
  @text() user_id!: string;
  @text({ max: 120 }) displayName!: string;
  @date() startDate!: Date;
  @date() endDate!: Date;
  @date() createdAt!: Date;
}
