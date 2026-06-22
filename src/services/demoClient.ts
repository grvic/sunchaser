/**
 * In-memory stand-in for the Rayfin data + auth client, enabled with
 * `VITE_DEMO=1`. It lets the full UI run offline with seed data — handy for
 * screenshots, design review, and trying the app without a Fabric backend.
 *
 * It implements only the subset of the client surface that `services/api.ts`
 * uses: a tiny fluent query builder plus `create`, `delete`, and `findById`.
 */

/** Switchable demo identities. Lets you experience the app as each crew member
 * (own votes, availability and row-level permissions) without real sign-in. */
export const DEMO_CREW = [
  { id: 'demo-vic', name: 'Vic', email: 'vic@demo.dev', emoji: '🌅' },
  { id: 'u-lucia', name: 'Lucía', email: 'lucia@demo.dev', emoji: '🏄‍♀️' },
  { id: 'u-mateo', name: 'Mateo', email: 'mateo@demo.dev', emoji: '🧭' },
  { id: 'u-noa', name: 'Noa', email: 'noa@demo.dev', emoji: '🐠' },
] as const;

export const DEMO_USER = DEMO_CREW[0];

let activeDemoUserId: string = DEMO_CREW[0].id;

export function getActiveDemoUser() {
  return DEMO_CREW.find((u) => u.id === activeDemoUserId) ?? DEMO_CREW[0];
}

export function setActiveDemoUser(id: string) {
  if (DEMO_CREW.some((u) => u.id === id)) activeDemoUserId = id;
  return getActiveDemoUser();
}

type Row = Record<string, unknown>;
type Where = Record<string, { eq: unknown }>;
/** Primary-key lookup used by delete/update — direct values, e.g. `{ id }`. */
type UniqueWhere = Record<string, unknown>;

class Table {
  rows: Row[] = [];

  private match(where?: Where) {
    if (!where) return this.rows;
    return this.rows.filter((r) =>
      Object.entries(where).every(([k, cond]) => r[k] === cond.eq)
    );
  }

  private findUnique(where: UniqueWhere) {
    return this.rows.find((r) =>
      Object.entries(where).every(([k, v]) => r[k] === v)
    );
  }

  select() {
    let where: Where | undefined;
    let order: Record<string, 'asc' | 'desc'> | undefined;
    const builder = {
      where: (w: Where) => {
        where = w;
        return builder;
      },
      orderBy: (o: Record<string, 'asc' | 'desc'>) => {
        order = o;
        return builder;
      },
      execute: async () => {
        let out = this.match(where).map((r) => ({ ...r }));
        if (order) {
          const [[key, dir]] = Object.entries(order);
          out = out.sort((a, b) => {
            const av = a[key] as number | string | Date;
            const bv = b[key] as number | string | Date;
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return dir === 'desc' ? -cmp : cmp;
          });
        }
        return out;
      },
    };
    return builder;
  }

  async findById(id: string) {
    const row = this.rows.find((r) => r.id === id);
    return row ? { ...row } : null;
  }

  async create(data: Row) {
    const row = { id: crypto.randomUUID(), ...data };
    this.rows.push(row);
    return { ...row };
  }

  async update(where: UniqueWhere, data: Row) {
    const row = this.findUnique(where);
    if (row) Object.assign(row, data);
    return row ? { ...row } : null;
  }

  async delete(where: UniqueWhere) {
    this.rows = this.rows.filter(
      (r) => !Object.entries(where).every(([k, v]) => r[k] === v)
    );
  }
}

function daysFromNow(start: number, length: number) {
  const s = new Date();
  s.setDate(s.getDate() + start);
  const e = new Date(s);
  e.setDate(e.getDate() + length);
  return { startDate: s, endDate: e };
}

function buildDemoData() {
  const data: Record<string, Table> = {
    TripGroup: new Table(),
    GroupMember: new Table(),
    Destination: new Table(),
    Vote: new Table(),
    Availability: new Table(),
    Profile: new Table(),
  };

  const groupId = 'grp-verano';
  const crew = DEMO_CREW;

  data.TripGroup.rows.push(
    {
      id: groupId,
      name: 'Cuadrilla del verano',
      emoji: '🎉',
      theme: 'crew',
      owner_id: DEMO_USER.id,
      ownerName: DEMO_USER.name,
      createdAt: new Date(),
    },
    {
      id: 'grp-family',
      name: 'Escapada familiar',
      emoji: '🏡',
      theme: 'family',
      owner_id: DEMO_USER.id,
      ownerName: DEMO_USER.name,
      createdAt: new Date(Date.now() - 86400000),
    }
  );

  for (const m of crew) {
    data.GroupMember.rows.push({
      id: `mem-${m.id}`,
      group_id: groupId,
      user_id: m.id,
      displayName: m.name,
      joinedAt: new Date(),
    });
  }
  data.GroupMember.rows.push({
    id: 'mem-family-vic',
    group_id: 'grp-family',
    user_id: DEMO_USER.id,
    displayName: DEMO_USER.name,
    joinedAt: new Date(),
  });

  const dests = [
    { id: 'd-ibiza', name: 'Ibiza', country: 'España', emoji: '🏖️', seed: 'ibiza', budget: 750, start: 45, len: 7 },
    { id: 'd-santorini', name: 'Santorini', country: 'Grecia', emoji: '🌅', seed: 'santorini', budget: 1100, start: 50, len: 6 },
    { id: 'd-lisboa', name: 'Lisboa', country: 'Portugal', emoji: '🚋', seed: 'lisboa', budget: 600, start: 40, len: 5 },
    { id: 'd-bali', name: 'Bali', country: 'Indonesia', emoji: '🌴', seed: 'bali', budget: 1600, start: 60, len: 10 },
  ];
  for (const d of dests) {
    const range = daysFromNow(d.start, d.len);
    data.Destination.rows.push({
      id: d.id,
      group_id: groupId,
      name: d.name,
      country: d.country,
      emoji: d.emoji,
      imageUrl: `https://picsum.photos/seed/sunchaser-${d.seed}/800/600`,
      estimatedBudget: d.budget,
      suggestedStart: range.startDate,
      suggestedEnd: range.endDate,
      proposedBy: crew[Math.floor(Math.random() * crew.length)].id,
      proposedByName: 'Vic',
      createdAt: new Date(),
    });
  }

  // Votes — Ibiza leads, Santorini second.
  const votes: [string, string][] = [
    ['d-ibiza', DEMO_USER.id],
    ['d-ibiza', 'u-lucia'],
    ['d-ibiza', 'u-mateo'],
    ['d-santorini', 'u-noa'],
    ['d-santorini', 'u-lucia'],
    ['d-lisboa', 'u-mateo'],
  ];
  for (const [destination_id, user_id] of votes) {
    data.Vote.rows.push({
      id: `vote-${destination_id}-${user_id}`,
      group_id: groupId,
      destination_id,
      user_id,
      value: 1,
      createdAt: new Date(),
    });
  }

  // Availability — overlapping window around days 45–52 for the golden window.
  const avail: [string, string, number, number][] = [
    [DEMO_USER.id, 'Vic', 40, 15],
    ['u-lucia', 'Lucía', 44, 12],
    ['u-mateo', 'Mateo', 45, 8],
    ['u-noa', 'Noa', 46, 9],
  ];
  for (const [user_id, displayName, start, len] of avail) {
    const range = daysFromNow(start, len);
    data.Availability.rows.push({
      id: `av-${user_id}`,
      group_id: groupId,
      user_id,
      displayName,
      startDate: range.startDate,
      endDate: range.endDate,
      createdAt: new Date(),
    });
  }

  return data;
}

let demoClient: { data: Record<string, Table> } | null = null;

export function getDemoClient() {
  if (!demoClient) demoClient = { data: buildDemoData() };
  return demoClient;
}

export function isDemoMode(): boolean {
  return import.meta.env.VITE_DEMO === '1';
}
