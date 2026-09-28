import { readFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { createState, reduce } from "../../packages/runtime/dist/index.js";

if (!process.argv[2])
  throw new Error(
    "Usage: node examples/attention-lab/replay.mjs <export.json>"
  );
const input = JSON.parse(await readFile(process.argv[2], "utf8"));
if (input.format !== "cosmo-lab-0.1" || input.simulated !== true)
  throw new Error("Unsupported lab format");
for (const profile of ["immediate", "cosmo"]) {
  const lane = input.lanes[profile];
  const state = lane.events.reduce(reduce, createState({ profile }));
  if (!isDeepStrictEqual(state, lane.state))
    throw new Error(`${profile}: replay differs from exported state`);
  console.log(
    `${profile}: replay verified (${lane.events.length} events, ${state.trace.length} trace records)`
  );
}
