import { createServer } from "node:http";
import { InfraiClient } from "./infrai_client";
import { requestPasswordReset } from "./forgot_password_service";

const client = new InfraiClient();
createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/forgot-password") { res.writeHead(404).end(); return; }
  let raw = "";
  for await (const chunk of req) raw += chunk;
  try {
    const result = await requestPasswordReset(JSON.parse(raw), client);
    res.writeHead(result.status, { "content-type": "application/json" }).end(JSON.stringify(result.body));
  } catch { res.writeHead(502).end(JSON.stringify({ accepted: false, message: "Upstream request failed" })); }
}).listen(Number(process.env.PORT ?? 3000));
