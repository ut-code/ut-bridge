import { useEffect } from "react";

export function VerificationWaiter({
  verificationId,
  onVerified,
}: {
  verificationId: string;
  onVerified: () => void;
}) {
  useEffect(() => {
    const sse = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/email/wait-for-verification?verificationId=${verificationId}`,
    );
    sse.addEventListener("verify", (event) => {
      const data = JSON.parse(event.data);
      if (data.verified) {
        onVerified();
      }
    });
    sse.addEventListener("ping", (event) => {
      console.log("ping");
    });
    return () => {
      sse.close();
    };
  }, [onVerified, verificationId]);
  return null;
}
