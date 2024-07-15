# Scout-sqlite (WIP)

> This is still a WIP tool. I am Looking for your feedback in [Feedback](https://github.com/JayJamieson/scout-sqlite/issues/1) issue.

Currently tools like [Drizzle ORM](https://orm.drizzle.team/docs/overview), [Kysely](https://kysely.dev/docs/intro) don't support SQLite FTS index creation through table definitions. Scout-sqlite aims to bridge that gap by helping create and manage FTS index creation by generating and applying the SQL for you.

## Getting Started

Ensure your turso databse URL and token are configured. See TS quick [start guide](https://docs.turso.tech/sdk/ts/quickstart) for how to generate a new token.

### Config for remote database

```env
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

### Config for local database

We can apply to a local database file by specifiying a local path instead of remote URL and skip `TURSO_AUTH_TOKEN`.

```env
TURSO_DATABASE_URL=file:./<path to file>
```

Install the `scout-sqlite` cli using your favourite package manager

| package manager | command |
| --------------- | ------- |
| npm | `npm install scout-sqlite -D` |
| pnpm | `pnpm add scout-sqlite -D` |
| yarn | `yarn add scout-sqlite -D` |
| bun | `bun install scout-sqlite` |

Initialize an empty configuration file with `npx scout init`. This creates a `sqlitefts5rc.json` file in the current working directory.

```json
[
  {
    "table": "YOUR TABLE HERE",
    "idColumn": "YOUR TABLE HERE",
    "columns": [
      "YOUR",
      "COLUMNS",
      "HERE"
    ]
  }
]
```

Replace place holder text with your own values then run `npx scout apply` to create the FTS5 indexes and management triggers.

- If you're using a local file then use `-l` or `--local` flag to bypass `TURSO_AUTH_TOKEN` requirement.

## Roadmap

- Handle updates of existing indexes and triggers
