#!/usr/bin/env node
import { program } from "commander";
import { DefaultConfig, getConfigPath, loadConfig } from "../config.js";
import { writeFile } from "fs/promises";

const configPath = await getConfigPath();

if (!configPath.isFound) {
  await writeFile(configPath.path, JSON.stringify(DefaultConfig, null, 2), {
    flag: "w+",
  });
}

const config = await loadConfig(configPath.path);

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
    // process.env.TURSO_DATABASE_URL=
    // process.env.TURSO_AUTH_TOKEN=
  });

await program.parseAsync();
