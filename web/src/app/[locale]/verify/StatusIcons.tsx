import type { ComponentProps } from "react";

type Status = "success" | "error" | "ready" | "processing";

function SuccessIcon(props: ComponentProps<"svg">) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-success/20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-success"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function ErrorIcon(props: ComponentProps<"svg">) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-error/20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-error"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}

function ReadyIcon(props: ComponentProps<"svg">) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

function ProcessingIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
}

type StatusIconsProps = {
  status: Status;
};

export function StatusIcon({ status }: StatusIconsProps) {
  switch (status) {
    case "success":
      return <SuccessIcon />;
    case "error":
      return <ErrorIcon />;
    case "ready":
      return <ReadyIcon />;
    case "processing":
      return <ProcessingIcon />;
    default:
      return null;
  }
}
