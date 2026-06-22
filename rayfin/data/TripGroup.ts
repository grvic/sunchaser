import { entity, authenticated, uuid, text, date } from '@microsoft/rayfin-core';

/**
 * A trip crew — friends, family, or a one-off getaway. A user can belong to
 * many groups. Anyone signed in can read groups (so invitees can join), but
 * only the owner can rename or delete their own group.
 */
@entity()
@authenticated('read')
@authenticated('create', { policy: (claims, item) => claims.sub.eq(item.owner_id) })
@authenticated('update', { policy: (claims, item) => claims.sub.eq(item.owner_id) })
@authenticated('delete', { policy: (claims, item) => claims.sub.eq(item.owner_id) })
export class TripGroup {
  @uuid() id!: string;
  @text({ min: 1, max: 80 }) name!: string;
  @text({ max: 16 }) emoji!: string;
  @text({ max: 30 }) theme!: string;
  @text() owner_id!: string;
  @text({ max: 120 }) ownerName!: string;
  @date() createdAt!: Date;
}
