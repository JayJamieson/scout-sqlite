import { findUp } from "find-up";
import { readFile } from "fs/promises";

export type Config = {
  isFound?: boolean;
  tables: IndexSchema[];
};

type IndexSchema = {
  idColumn: string;
  table: string;
  columns: string[];
};

export const DefaultPath = `${process.cwd()}/sqlitefts5rc.json`;

export const DefaultConfig: IndexSchema[] = [
  {
    table: "YOUR TABLE HERE",
    idColumn: "YOUR TABLE HERE",
    columns: ["YOUR", "COLUMNS", "HERE"],
  },
];

const configPaths = Object.freeze([
  "sqlitefts.json",
  "sqlitefts5.json",
  "sqlite-fts.json",
  "sqliteftsrc.json",
  "sqlitefts5rc.json",
  ".sqliteftsrc",
  ".sqlitefts",
  ".sqlitefts5",
  ".sqlitefts5rc",
]);

export async function getConfigPath(): Promise<{
  isFound: boolean;
  path: string;
}> {
  const foundPath = await findUp(configPaths);

  if (foundPath === undefined) {
    return { isFound: false, path: DefaultPath };
  }
  return { isFound: true, path: foundPath };
}

export async function loadConfig(path: string): Promise<IndexSchema[]> {
  const config: IndexSchema[] = JSON.parse(await readFile(path, "utf8"));
  return config;
}
