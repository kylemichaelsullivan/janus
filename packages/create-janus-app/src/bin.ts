#!/usr/bin/env node
import { scaffoldApp } from "./scaffold.js";

const target = process.argv[2] ?? "janus-app";
scaffoldApp(target);
console.log(`Created ${target}. Next: cd ${target} && pnpm install && janus doctor`);
