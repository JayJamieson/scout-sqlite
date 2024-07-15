#!/usr/bin/env node
import { program } from "commander";
import { DefaultConfig, getConfigPath, loadConfig } from "../config.js";
import { writeFile } from "fs/promises";
import { createClient } from "@libsql/client";
import fts5Table from "sqlite-fts-util";

const configPath = await getConfigPath();

const makeClient = (options: { url: string; authToken?: string }) => {
  return options.authToken
    ? createClient({
        url: options.url,
        authToken: options.authToken,
      })
    : createClient({
        url: options.url,
      });
};

program
  .name("scout-sqlite")
  .description(
    "scout-sqlite is a utility CLI to help generate or apply FTS5 indexes to your SQLite databases",
  )
  .version("0.0.2");

program
  .command("apply")
  .option("-l, --local", "use local file", false)
  .description("apply fts5 index configuration to your turso database")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .action(async function (params: { local: boolean }, options) {
    if (!configPath.isFound) {
      program.error("No configuration file found, use init to create one");
    }
    const config = await loadConfig(configPath.path);

    if (process.env.TURSO_DATABASE_URL === undefined) {
      program.error(
        "Please setup TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variable.\nSee: https://docs.turso.tech/sdk/ts/quickstart\n",
      );
    }

    if (process.env.TURSO_AUTH_TOKEN === undefined && !params.local) {
      program.error(
        "Please setup TURSO_AUTH_TOKEN environment variable or use -l flag for local files.\nSee: https://docs.turso.tech/sdk/ts/quickstart\n",
      );
    }

    const dbClient = makeClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    for (const schema of config) {
      const sqlFTS = fts5Table({
        table: schema.table,
        idColumn: schema.idColumn,
        columns: schema.columns,
      });

      const sql = `BEGIN TRANSACTION;\n${sqlFTS()}\nCOMMIT;`;

      try {
        console.log("Creating FTS5 index for table:", schema.table);
        await dbClient.executeMultiple(sql);
      } catch (error) {
        console.log(
          "Skipping index creation due to error:",
          (error as Error).message,
        );
      }
    }
  });

program
  .command("init")
  .description("create configuration file")
  .action(async function () {
    if (configPath.isFound) {
      return;
    }

    await writeFile(configPath.path, JSON.stringify(DefaultConfig, null, 2), {
      flag: "w+",
    });
  });

await program.parseAsync();
