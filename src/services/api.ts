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
  lat: number;
  lng: number;
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

  const ids = [...new Set(memberships.map((m) => m.group_id))];
  const groups = await Promise.all(
    ids.map((id) =>
      client.data.TripGroup.select([
        'id',
        'name',
        'emoji',
        'theme',
        'owner_id',
        'ownerName',
        'createdAt',
      ])
        .where({ id: { eq: id } })
        .execute()
        .then((rows) => rows[0])
    )
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

/** Update a group's name and/or emoji. Only the owner passes the RLS policy. */
export async function updateGroup(
  groupId: string,
  input: { name?: string; emoji?: string }
): Promise<void> {
  const client = getRayfinClient();
  const patch: { name?: string; emoji?: string } = {};
  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.emoji !== undefined) patch.emoji = input.emoji;
  if (Object.keys(patch).length === 0) return;
  await client.data.TripGroup.update({ id: groupId }, patch);
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
    'lat',
    'lng',
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
    imageUrl?: string;
    estimatedBudget: number;
    lat: number;
    lng: number;
    suggestedStart: Date;
    suggestedEnd: Date;
  },
  user: { id: string; name: string }
): Promise<DestinationItem> {
  const client = getRayfinClient();
  const created = (await client.data.Destination.create({
    ...input,
    imageUrl: input.imageUrl ?? '',
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

// ---------------------------------------------------------------------------
// Profile (display name)
// ---------------------------------------------------------------------------

/** Resolve the user's chosen display name, falling back to their auth name. */
export async function getMyDisplayName(
  userId: string,
  fallback: string
): Promise<string> {
  const client = getRayfinClient();
  const rows = await client.data.Profile.select(['displayName'])
    .where({ user_id: { eq: userId } })
    .execute();
  const name = rows[0]?.displayName;
  return name && name.trim() ? name : fallback;
}

/**
 * Set the user's display name. Upserts their Profile (the source of truth) and
 * propagates the new name to the denormalized snapshots they own across the app
 * so members lists, proposals and availability update everywhere.
 */
export async function setMyDisplayName(
  userId: string,
  displayName: string
): Promise<void> {
  const client = getRayfinClient();
  const name = displayName.trim();

  const existing = await client.data.Profile.select(['id'])
    .where({ user_id: { eq: userId } })
    .execute();
  if (existing.length > 0) {
    await client.data.Profile.update(
      { id: existing[0].id },
      { displayName: name, updatedAt: new Date() }
    );
  } else {
    await client.data.Profile.create({
      user_id: userId,
      displayName: name,
      avatar: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  const members = await client.data.GroupMember.select(['id'])
    .where({ user_id: { eq: userId } })
    .execute();
  const avails = await client.data.Availability.select(['id'])
    .where({ user_id: { eq: userId } })
    .execute();
  const dests = await client.data.Destination.select(['id'])
    .where({ proposedBy: { eq: userId } })
    .execute();
  const owned = await client.data.TripGroup.select(['id'])
    .where({ owner_id: { eq: userId } })
    .execute();

  await Promise.all([
    ...members.map((m) =>
      client.data.GroupMember.update({ id: m.id }, { displayName: name })
    ),
    ...avails.map((a) =>
      client.data.Availability.update({ id: a.id }, { displayName: name })
    ),
    ...dests.map((d) =>
      client.data.Destination.update({ id: d.id }, { proposedByName: name })
    ),
    ...owned.map((g) =>
      client.data.TripGroup.update({ id: g.id }, { ownerName: name })
    ),
  ]);
}

/** Read the user's avatar config (opaque JSON string), or '' if unset. */
export async function getMyAvatar(userId: string): Promise<string> {
  const client = getRayfinClient();
  const rows = await client.data.Profile.select(['avatar'])
    .where({ user_id: { eq: userId } })
    .execute();
  return rows[0]?.avatar ?? '';
}

/** Persist the user's avatar config, upserting their Profile. */
export async function setMyAvatar(
  userId: string,
  avatar: string
): Promise<void> {
  const client = getRayfinClient();
  const existing = await client.data.Profile.select(['id'])
    .where({ user_id: { eq: userId } })
    .execute();
  if (existing.length > 0) {
    await client.data.Profile.update(
      { id: existing[0].id },
      { avatar, updatedAt: new Date() }
    );
  } else {
    await client.data.Profile.create({
      user_id: userId,
      displayName: '',
      avatar,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

// ---------------------------------------------------------------------------
// Personal trips (private per-user calendar)
// ---------------------------------------------------------------------------

export interface TripItem {
  id: string;
  user_id: string;
  title: string;
  emoji: string;
  color: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export async function getMyTrips(userId: string): Promise<TripItem[]> {
  const client = getRayfinClient();
  const rows = await client.data.Trip.select([
    'id',
    'user_id',
    'title',
    'emoji',
    'color',
    'startDate',
    'endDate',
    'createdAt',
  ])
    .where({ user_id: { eq: userId } })
    .orderBy({ startDate: 'asc' })
    .execute();
  return rows.map(
    (t) =>
      ({
        ...t,
        startDate: toDate(t.startDate),
        endDate: toDate(t.endDate),
        createdAt: toDate(t.createdAt),
      }) as TripItem
  );
}

export async function createTrip(
  userId: string,
  input: {
    title: string;
    emoji: string;
    color: string;
    startDate: Date;
    endDate: Date;
  }
): Promise<void> {
  const client = getRayfinClient();
  await client.data.Trip.create({
    ...input,
    user_id: userId,
    createdAt: new Date(),
  });
}

export async function updateTrip(
  id: string,
  input: {
    title: string;
    emoji: string;
    color: string;
    startDate: Date;
    endDate: Date;
  }
): Promise<void> {
  const client = getRayfinClient();
  await client.data.Trip.update({ id }, input);
}

export async function deleteTrip(id: string): Promise<void> {
  const client = getRayfinClient();
  await client.data.Trip.delete({ id });
}
