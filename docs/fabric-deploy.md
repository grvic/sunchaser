# Fabric deployment log

This is the real deployment of Sunchaser to Microsoft Fabric, produced by
`npx rayfin up` against the `fabric-apps` workspace.

## Result

| | |
|---|---|
| **Status** | ✅ Deployed & healthy |
| **Live app** | https://real-dew-3d5950b392-swedencentral.webapp.fabricapps.net |
| **Workspace** | `fabric-apps` |
| **Rayfin item** | `sunchaser` (AppBackend) |
| **SQL database** | `sunchaser` |
| **Services** | `auth: enabled`, `data: enabled` |
| **Endpoint health** | ✅ Reachable |

> Item IDs, the workload endpoint and the publishable key are written to
> `rayfin/.deployments.json` (git-ignored). Run `npx rayfin up status` to print
> the current values.

## What `rayfin up` did

1. **Created/updated the Fabric AppBackend item** in the `fabric-apps` workspace.
2. **Applied runtime settings** and retrieved the publishable key.
3. **Compiled the entities** in `rayfin/data/` and generated a Data API Builder
   config — all five entities recognised with their permission roles:

   | Entity | Fields | Permission roles |
   |---|---|---|
   | `TripGroup` | 7 | 1 |
   | `GroupMember` | 5 | 1 |
   | `Destination` | 12 | 1 |
   | `Vote` | 6 | 1 |
   | `Availability` | 7 | 1 |

4. **Applied the database configuration** to the Fabric MSSQL database `sunchaser`.
5. **Built the frontend** (`npm run build:fabric` → `tsc -b && vite build`) and
   **deployed the static content** (3 files, ~346 KB).
6. **Registered the hosting URL** as an allowed redirect URI for Fabric SSO.

## Re-deploying

```bash
npm run rayfin:up        # full build + deploy + schema apply
npx rayfin up status     # health check
```

For schema-only iterations, `npx rayfin up db apply`. Destructive schema
changes require `--force`.
