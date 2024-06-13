#!/usr/bin/env node
import { program } from "commander";
import { DefaultConfig, getConfigPath, loadConfig } from "../config.js";
import { writeFile } from "fs/promises";
import { createClient } from "@libsql/client";
import fts5Table from "sqlite-fts-util";

const configPath = await getConfigPath();

program
  .name("scout-sqlite")
  .description(
    "scout-sqlite is a utility CLI to help generate or apply FTS5 indexes to your SQLite databases",
  )
  .version("0.0.1");

program
  .command("apply")
  .description("apply fts5 index configuration to your turso database")
  .action(async function (params, options) {
    if (!configPath.isFound) {
      program.error("No configuration file found, use init to create one");
    }
    const config = await loadConfig(configPath.path);

    if (
      process.env.TURSO_DATABASE_URL === undefined ||
      process.env.TURSO_AUTH_TOKEN === undefined
    ) {
      program.error(
        "Please setup TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.\nSee: https://docs.turso.tech/sdk/ts/quickstart",
      );
    }

    const turso = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const first = config.pop()!;

    const sqlFTS = fts5Table({
      table: first.table,
      idColumn: first.idColumn,
      columns: first.columns,
    });

    const sql = `BEGIN TRANSACTION;\n${sqlFTS()}\nCOMMIT;`;

    try {
      const result = await turso.executeMultiple(sql);
      console.log(result);
    } catch (error) {
      console.log(error);
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
