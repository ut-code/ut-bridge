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
      {status === "error" && <p className={className}>Email verification failed!</p>}
      {status === "processing" && <p className={className}>Processing...</p>}
      {status === "ready" && <VerifyButton setStatus={setStatus} />}
    </div>
  );
}

function VerifyButton({
  setStatus,
}: { setStatus: React.Dispatch<React.SetStateAction<"ready" | "processing" | "error" | "success">> }) {
  const params = useSearchParams();
  const id = params.get("id");
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        if (!id) return;
        try {
          setStatus("processing");
          const res = await client.email.verify.$put({
            param: {
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
