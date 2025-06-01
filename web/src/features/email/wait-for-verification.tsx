import { API_ENDPOINT } from "@/client";

export function waitForVerification(verificationId: string, then: () => void) {
  const sse = new EventSource(`${API_ENDPOINT}/email/wait-for-verification?verificationId=${verificationId}`);
  sse.addEventListener("verify", (event) => {
    const data = JSON.parse(event.data);
    if (data.verified) {
      then();
    }
  });
  sse.addEventListener("ping", () => {
    console.log("[VerificationWaiter] ping");
  });
}
