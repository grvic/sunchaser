import {
  entity,
  authenticated,
  uuid,
  text,
  int,
  date,
} from '@microsoft/rayfin-core';

/**
 * A candidate destination proposed inside a {@link TripGroup}. Everyone in the
 * crew can read proposals, but only the person who proposed it can edit or
 * remove it (row-level security on `proposedBy`).
 */
@entity()
@authenticated('read')
@authenticated('create', { policy: (claims, item) => claims.sub.eq(item.proposedBy) })
@authenticated('update', { policy: (claims, item) => claims.sub.eq(item.proposedBy) })
@authenticated('delete', { policy: (claims, item) => claims.sub.eq(item.proposedBy) })
export class Destination {
  @uuid() id!: string;
  @uuid() group_id!: string;
  @text({ min: 1, max: 80 }) name!: string;
  @text({ max: 60 }) country!: string;
  @text({ max: 16 }) emoji!: string;
  @text({ max: 600 }) imageUrl!: string;
  @int() estimatedBudget!: number;
  @date() suggestedStart!: Date;
  @date() suggestedEnd!: Date;
  @text() proposedBy!: string;
  @text({ max: 120 }) proposedByName!: string;
  @date() createdAt!: Date;
}
