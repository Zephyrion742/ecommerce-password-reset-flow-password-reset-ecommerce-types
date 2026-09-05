import { z } from "zod";
import { InfraiClient, InfraiError } from "./infrai_client";

export const ForgotPasswordBody = z.object({ email: z.string().email(), captchaToken: z.string().min(1) });
export type ResetDecision = { status: number; body: { accepted: boolean; message: string } };

export async function requestPasswordReset(input: unknown, infrai: InfraiClient): Promise<ResetDecision> {
  const parsed = ForgotPasswordBody.safeParse(input);
  if (!parsed.success) return { status: 400, body: { accepted: false, message: "Invalid request" } };
  try {
    const check = await infrai.captcha.verify({
      widget_record_id: "forgot_password",
      token: parsed.data.captchaToken,
      action: "forgot_password"
    });
    if (!check.passed) return { status: 422, body: { accepted: false, message: "Captcha rejected" } };
    await infrai.password.reset_request({ email: parsed.data.email });
    return { status: 202, body: { accepted: true, message: "Reset email queued" } };
  } catch (error) {
    if (error instanceof InfraiError && error.status < 500) return { status: error.status, body: { accepted: false, message: error.code } };
    throw error;
  }
}
