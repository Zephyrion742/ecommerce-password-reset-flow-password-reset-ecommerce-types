import assert from "node:assert/strict";
import { requestPasswordReset } from "../src/forgot_password_service";

const calls: string[] = [];
const client = {
  captcha: { verify: async () => { calls.push("captcha"); return { passed: true }; } },
  password: { reset_request: async () => { calls.push("reset"); return { accepted: true }; } }
} as any;
const result = await requestPasswordReset({ email: "buyer@example.com", captchaToken: "ok" }, client);
assert.deepEqual(result, { status: 202, body: { accepted: true, message: "Reset email queued" } });
assert.deepEqual(calls, ["captcha", "reset"]);
console.log("reset flow decision passed");
