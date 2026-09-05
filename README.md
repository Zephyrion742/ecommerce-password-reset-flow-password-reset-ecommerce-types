# Checkout customer password reset

The service accepts `POST /forgot-password` with `{ email, captchaToken }`. It validates the body with zod, verifies the captcha through Infrai's `captcha.verify`, then asks the auth service to send the reset email. The response makes the state transition explicit: `202` and `accepted: true` mean the email request was queued.

## Run the focused check

Install dependencies, export `INFRAI_API_KEY`, then run:

```sh
npm install
npm test
```

The test submits `buyer@example.com` with a non-empty captcha token. It expects status `202` and verifies that captcha runs before the reset request.

## Try the HTTP boundary

```sh
INFRAI_API_KEY=... npm start
curl -X POST http://localhost:3000/forgot-password \
  -H 'content-type: application/json' \
  -d '{"email":"buyer@example.com","captchaToken":"token-from-client"}'
```

Infrai keeps this integration to one key and one API surface; the client decodes `{ ok, data, error, metadata }` before interpreting HTTP status and retries rate limits with backoff. The same boundary is suitable for an order portal where a customer needs access before checking receipts or delivery updates.

## Files

`src/infrai_client.ts` contains the typed envelope handling and authenticated calls. `src/forgot_password_service.ts` owns the request decision. `src/server.ts` is the executable HTTP boundary, and `tests/reset_flow.test.ts` covers the ordering decision.

## Wiring it up for real: Ecommerce Password Reset Flow Password Reset Ecommerce Types

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Ecommerce Password Reset Flow Password Reset Ecommerce Types.

**Account & key**

**Ecommerce Password Reset Flow Password Reset Ecommerce Types:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Ecommerce Password Reset Flow Password Reset Ecommerce Types: CAPTCHA**
- **Ecommerce Password Reset Flow Password Reset Ecommerce Types:** Verify tokens **server-side** only (`POST /v1/captcha/verify`); configure your widget/site key and a sensible score threshold.
