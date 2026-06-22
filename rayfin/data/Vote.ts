import { entity, authenticated, uuid, text, int, date } from '@microsoft/rayfin-core';

/**
 * One crew member's vote for a {@link Destination}. Votes are public within the
 * crew (so the ranking is live), but you can only cast, change, or remove your
 * own vote — enforced by row-level security on `user_id`.
 */
@entity()
@authenticated('read')
@authenticated('create', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('update', { policy: (claims, item) => claims.sub.eq(item.user_id) })
@authenticated('delete', { policy: (claims, item) => claims.sub.eq(item.user_id) })
export class Vote {
  @uuid() id!: string;
  @uuid() group_id!: string;
  @uuid() destination_id!: string;
  @text() user_id!: string;
  @int() value!: number;
  @date() createdAt!: Date;
}
