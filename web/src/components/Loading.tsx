const debug_mode = false;
export default function Loading(_props: { stage: string }) {
  return (
    <>
      <div className="fixed top-[50vh] left-0 flex w-full flex-row justify-center">
        <span className="loading loading-xl loading-spinner" />
        {debug_mode && ` loading stage: ${_props.stage}`}
      </div>
    </>
  );
}
