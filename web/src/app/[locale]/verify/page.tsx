"use client";

import { client } from "@/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const className = "btn btn-primary";
export default function Page() {
  const [status, setStatus] = useState<"ready" | "processing" | "error" | "success">("ready");

  return (
    <div>
      <h1>Verify Your Email</h1>
      {status === "success" && (
        <a href="/community" className={className}>
          Email verified successfully!
        </a>
      )}
      {status === "error" && (
        <button type="button" className={className} onClick={() => setStatus("ready")}>
          Email verification failed! try again
        </button>
      )}
      {status === "processing" && <p className={className}>Processing...</p>}
      {status === "ready" && <VerifyButton setStatus={setStatus} />}
    </div>
  );
}

function VerifyButton({
  setStatus,
}: { setStatus: React.Dispatch<React.SetStateAction<"ready" | "processing" | "error" | "success">> }) {
  const params = useSearchParams();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        const id = params.get("id");
        if (!id) {
          console.error("id is not provided");
          return null;
        }
        try {
          setStatus("processing");
          const res = await client.email.verify.$put({
            query: {
              id,
            },
          });
          if (!res.ok) throw new Error(`verification failed with status ${res.status}`);
          setStatus("success");
          console.log("verification done");
        } catch (error) {
          setStatus("error");
          console.error("verification failed");
        }
      }}
    >
      Verify
    </button>
  );
}
