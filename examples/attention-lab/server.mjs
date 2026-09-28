import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const assets = new Map([
  ["/", ["./index.html", "text/html"]],
  ["/app.js", ["./app.js", "text/javascript"]],
  ["/scenarios.js", ["./scenarios.js", "text/javascript"]],
  ["/style.css", ["./style.css", "text/css"]],
  ["/runtime.js", ["../../packages/runtime/dist/index.js", "text/javascript"]],
]);
const server = createServer(async (req, res) => {
  const asset = assets.get(
    new URL(req.url ?? "/", "http://localhost").pathname
  );
  if (req.method !== "GET" || !asset) {
    res.writeHead(404).end("Not found");
    return;
  }
  try {
    const body = await readFile(new URL(asset[0], import.meta.url));
    res.writeHead(200, {
      "Content-Type": `${asset[1]}; charset=utf-8`,
      "Cache-Control": "no-store",
      "Content-Security-Policy":
        "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'",
    });
    res.end(body);
  } catch {
    res.writeHead(500).end("Build @cosmo/runtime before starting the lab.");
  }
});
server.listen(Number(process.env.PORT ?? 4318), "127.0.0.1", () => {
  console.log(`COSMO Attention Lab: http://127.0.0.1:${server.address().port}`);
});
