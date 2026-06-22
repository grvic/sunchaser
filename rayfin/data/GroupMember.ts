import { entity, authenticated, uuid, text, date } from '@microsoft/rayfin-core';

/**
 * Membership join row linking a user to a {@link TripGroup}. Reads are shared
 * so a crew can see who's in. Each user manages only their own membership rows
 * (join / leave), enforced by row-level security on `user_id`.
 */
@entity()
@authenticated('read')
@authenticated('create', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('delete', { policy: (claims, item) => claims.sub.eq(item.user_id) })
export class GroupMember {
  @uuid() id!: string;
  @uuid() group_id!: string;
  @text() user_id!: string;
  @text({ max: 120 }) displayName!: string;
  @date() joinedAt!: Date;
}
