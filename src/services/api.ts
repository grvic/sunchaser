import { getRayfinClient } from './rayfinClient';

export interface Group {
  id: string;
  name: string;
  emoji: string;
  theme: string;
  owner_id: string;
  ownerName: string;
  createdAt: Date;
}

export interface Member {
  id: string;
  group_id: string;
  user_id: string;
  displayName: string;
  joinedAt: Date;
}

export interface DestinationItem {
  id: string;
  group_id: string;
  name: string;
  country: string;
  emoji: string;
  imageUrl: string;
  estimatedBudget: number;
  suggestedStart: Date;
  suggestedEnd: Date;
  proposedBy: string;
  proposedByName: string;
  createdAt: Date;
}

export interface VoteItem {
  id: string;
  group_id: string;
  destination_id: string;
  user_id: string;
  value: number;
  createdAt: Date;
}

export interface AvailabilityItem {
  id: string;
  group_id: string;
  user_id: string;
  displayName: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

const toDate = (value: unknown): Date =>
  value instanceof Date ? value : new Date(value as string);

// ---------------------------------------------------------------------------
// Groups & membership
// ---------------------------------------------------------------------------

export async function getMyGroups(userId: string): Promise<Group[]> {
  const client = getRayfinClient();
  const memberships = await client.data.GroupMember.select(['group_id'])
    .where({ user_id: { eq: userId } })
    .execute();

  const groups = await Promise.all(
    memberships.map((m) => client.data.TripGroup.findById(m.group_id))
  );

  return groups
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => ({ ...g, createdAt: toDate(g.createdAt) }) as Group)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createGroup(
  input: { name: string; emoji: string; theme: string },
  user: { id: string; name: string }
): Promise<Group> {
  const client = getRayfinClient();
  const group = (await client.data.TripGroup.create({
    name: input.name,
    emoji: input.emoji,
    theme: input.theme,
    owner_id: user.id,
    ownerName: user.name,
    createdAt: new Date(),
  })) as Group;

  await client.data.GroupMember.create({
    group_id: group.id,
    user_id: user.id,
    displayName: user.name,
    joinedAt: new Date(),
  });

  return { ...group, createdAt: toDate(group.createdAt) };
}

export async function joinGroup(
  groupId: string,
  user: { id: string; name: string }
): Promise<void> {
  const client = getRayfinClient();
  const existing = await client.data.GroupMember.select(['id'])
    .where({ group_id: { eq: groupId }, user_id: { eq: user.id } })
    .execute();
  if (existing.length > 0) return;

  await client.data.GroupMember.create({
    group_id: groupId,
    user_id: user.id,
    displayName: user.name,
    joinedAt: new Date(),
  });
}

export async function getGroupMembers(groupId: string): Promise<Member[]> {
  const client = getRayfinClient();
  const members = await client.data.GroupMember.select([
    'id',
    'group_id',
    'user_id',
    'displayName',
    'joinedAt',
  ])
    .where({ group_id: { eq: groupId } })
    .execute();
  return members.map((m) => ({ ...m, joinedAt: toDate(m.joinedAt) }) as Member);
}

// ---------------------------------------------------------------------------
// Destinations
// ---------------------------------------------------------------------------

export async function getDestinations(
  groupId: string
): Promise<DestinationItem[]> {
  const client = getRayfinClient();
  const rows = await client.data.Destination.select([
    'id',
    'group_id',
    'name',
    'country',
    'emoji',
    'imageUrl',
    'estimatedBudget',
    'suggestedStart',
    'suggestedEnd',
    'proposedBy',
    'proposedByName',
    'createdAt',
  ])
    .where({ group_id: { eq: groupId } })
    .orderBy({ createdAt: 'desc' })
    .execute();

  return rows.map(
    (d) =>
      ({
        ...d,
        suggestedStart: toDate(d.suggestedStart),
        suggestedEnd: toDate(d.suggestedEnd),
        createdAt: toDate(d.createdAt),
      }) as DestinationItem
  );
}

export async function createDestination(
  input: {
    group_id: string;
    name: string;
    country: string;
    emoji: string;
    imageUrl: string;
    estimatedBudget: number;
    suggestedStart: Date;
    suggestedEnd: Date;
  },
  user: { id: string; name: string }
): Promise<DestinationItem> {
  const client = getRayfinClient();
  const created = (await client.data.Destination.create({
    ...input,
    proposedBy: user.id,
    proposedByName: user.name,
    createdAt: new Date(),
  })) as DestinationItem;
  return {
    ...created,
    suggestedStart: toDate(created.suggestedStart),
    suggestedEnd: toDate(created.suggestedEnd),
    createdAt: toDate(created.createdAt),
  };
}

export async function deleteDestination(id: string): Promise<void> {
  const client = getRayfinClient();
  await client.data.Destination.delete({ id });
}

// ---------------------------------------------------------------------------
// Votes
// ---------------------------------------------------------------------------

export async function getVotes(groupId: string): Promise<VoteItem[]> {
  const client = getRayfinClient();
  const rows = await client.data.Vote.select([
    'id',
    'group_id',
    'destination_id',
    'user_id',
    'value',
    'createdAt',
  ])
    .where({ group_id: { eq: groupId } })
    .execute();
  return rows.map((v) => ({ ...v, createdAt: toDate(v.createdAt) }) as VoteItem);
}

/** Toggle the current user's vote for a destination. Returns the new state. */
export async function toggleVote(
  groupId: string,
  destinationId: string,
  userId: string
): Promise<boolean> {
  const client = getRayfinClient();
  const existing = await client.data.Vote.select(['id'])
    .where({ destination_id: { eq: destinationId }, user_id: { eq: userId } })
    .execute();

  if (existing.length > 0) {
    await Promise.all(
      existing.map((v) => client.data.Vote.delete({ id: v.id }))
    );
    return false;
  }

  await client.data.Vote.create({
    group_id: groupId,
    destination_id: destinationId,
    user_id: userId,
    value: 1,
    createdAt: new Date(),
  });
  return true;
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

export async function getAvailability(
  groupId: string
): Promise<AvailabilityItem[]> {
  const client = getRayfinClient();
  const rows = await client.data.Availability.select([
    'id',
    'group_id',
    'user_id',
    'displayName',
    'startDate',
    'endDate',
    'createdAt',
  ])
    .where({ group_id: { eq: groupId } })
    .execute();
  return rows.map(
    (a) =>
      ({
        ...a,
        startDate: toDate(a.startDate),
        endDate: toDate(a.endDate),
        createdAt: toDate(a.createdAt),
      }) as AvailabilityItem
  );
}

export async function addAvailability(
  input: { group_id: string; startDate: Date; endDate: Date },
  user: { id: string; name: string }
): Promise<AvailabilityItem> {
  const client = getRayfinClient();
  const created = (await client.data.Availability.create({
    ...input,
    user_id: user.id,
    displayName: user.name,
    createdAt: new Date(),
  })) as AvailabilityItem;
  return {
    ...created,
    startDate: toDate(created.startDate),
    endDate: toDate(created.endDate),
    createdAt: toDate(created.createdAt),
  };
}

export async function deleteAvailability(id: string): Promise<void> {
  const client = getRayfinClient();
  await client.data.Availability.delete({ id });
}
