import { entity, authenticated, uuid, text, date } from '@microsoft/rayfin-core';

/**
 * A personal trip on a user's own calendar — independent of any group. These
 * are private: every action (including read) is scoped to the owner via
 * row-level security on `user_id`, so no one else can see your trips.
 */
@entity()
@authenticated('read', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('create', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('update', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('delete', { policy: (claims, item) => claims.sub.eq(item.user_id) })
export class Trip {
  @uuid() id!: string;
  @text() user_id!: string;
  @text({ min: 1, max: 120 }) title!: string;
  @text({ max: 16 }) emoji!: string;
  @text({ max: 20 }) color!: string;
  @date() startDate!: Date;
  @date() endDate!: Date;
  @date() createdAt!: Date;
}
