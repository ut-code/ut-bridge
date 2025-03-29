const debug_mode = false;
export default function Loading(_props: { stage: string }) {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="mr-auto ml-auto max-h-8 w-fit flex-1">
          <span className="loading loading-xl loading-spinner" />
          {debug_mode && ` loading stage: ${_props.stage}`}
        </div>
      </div>
    </>
  );
}
