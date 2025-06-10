const debug_mode = true;

export default function Loading(_props: { stage: string }) {
  const server = typeof window === "undefined" ? "Server" : "Client";

  return (
    <>
      <div className="fixed top-[50vh] left-0 flex w-full flex-row justify-center">
        <span className="loading loading-xl loading-spinner" />
        {debug_mode && (
          <div className="text-gray-500">
            [{server}] loading stage: {_props.stage}
          </div>
        )}
      </div>
    </>
  );
}
