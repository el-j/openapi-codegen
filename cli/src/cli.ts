#!/usr/bin/env node

import { Cli } from "clipanion";

import { GenerateCommand } from "./commands/GenerateCommand";
import { InitCommand } from "./commands/InitCommand";
import { readFileSync } from "fs";
import { join } from "path";

const [_node, _app, ...args] = process.argv;
const packageJSON = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
);

const cli = new Cli({
  binaryLabel: `OpenAPI codegen`,
  binaryName: `openapi-codegen`,
  binaryVersion: packageJSON.version,
});

cli.register(InitCommand);
cli.register(GenerateCommand);
cli.runExit(args);