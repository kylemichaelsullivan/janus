#!/usr/bin/env node
import { runCommand } from "./index.js";

const output = runCommand(process.argv, process.cwd());
console.log(output);
if (output.startsWith("fail") || output.startsWith("Usage") || output.startsWith("REFUSED")) {
  process.exitCode = 1;
}
