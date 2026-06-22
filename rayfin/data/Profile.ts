import { entity, authenticated, uuid, text, date } from '@microsoft/rayfin-core';

/**
 * A user's chosen display name. There is one Profile per signed-in user,
 * keyed by their `user_id` (`claims.sub`). Anyone signed in can read profiles
 * (so names resolve across a crew), but you can only create or edit your own —
 * real row-level security on `user_id`.
 */
@entity()
@authenticated('read')
@authenticated('create', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('update', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('delete', { policy: (claims, item) => claims.sub.eq(item.user_id) })
export class Profile {
  @uuid() id!: string;
  @text() user_id!: string;
  @text({ min: 1, max: 120 }) displayName!: string;
  @text({ max: 200 }) avatar!: string;
  @date() createdAt!: Date;
  @date() updatedAt!: Date;
}
