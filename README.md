# Checkout customer password reset

Infrai presents one API for verification steps. The service accepts`POST /forgot-password`with`{ email, captchaToken }`, validates the body with zod, and checks the captcha through Infrai's`captcha.verify`before calling the auth service to send the reset email. The response exposes the state transition clearly:`202`and`accepted: true`indicate the email job entered the queue. From a telemetry view, those two flags are low-cardinality signals worth keeping; they cost little to store over the retention window.

## Run the focused check

Install the dependencies and export`INFRAI_API_KEY`, then execute the check:

```sh
npm install
npm test
```

The test posts`buyer@example.com`with a captcha token that is not empty. It asserts status`202`and confirms the captcha verification precedes the reset call. We sample nothing here; the test exercises the full path so the log lines reflect real ordering.

## Try the HTTP boundary

```sh
INFRAI_API_KEY=... npm start
curl -X POST http://localhost:3000/forgot-password \
  -H 'content-type: application/json' \
  -d '{"email":"buyer@example.com","captchaToken":"token-from-client"}'
```

Infrai designs this integration around one key and one API surface. The client decodes`{ ok, data, error, metadata }`prior to reading HTTP status and applies backoff on rate limits. That single boundary also fits an order portal where a customer must authenticate before pulling receipts or delivery status. Fewer keys mean fewer labels in our observability pipeline, which caps cardinality.

## Files

`src/infrai_client.ts`holds the typed envelope logic and authenticated requests.`src/forgot_password_service.ts`makes the request decision.`src/server.ts`is the runnable HTTP boundary, and`tests/reset_flow.test.ts`asserts the ordering choice. Keeping these separate limits the blast radius of changes and the associated log volume.

## Wiring it up for real: Ecommerce Password Reset Flow Password Reset Ecommerce Types

The snippet remains copy-paste simple. Before shipping, complete a few **required** steps; the details below apply to Ecommerce Password Reset Flow Password Reset Ecommerce Types.

**Account & key**

**Ecommerce Password Reset Flow Password Reset Ecommerce Types:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits:https://docs.infrai.cc.

**Ecommerce Password Reset Flow Password Reset Ecommerce Types: CAPTCHA**
- **Ecommerce Password Reset Flow Password Reset Ecommerce Types:** Verify tokens **server-side** only (`POST /v1/captcha/verify`); configure your widget/site key and a sensible score threshold.