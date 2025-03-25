export default function Loading(props: { stage: string }) {
  return (
    <>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="mr-auto ml-auto max-h-8 w-fit flex-1">
          <span className="loading loading-xl loading-spinner" />
          {/* loading stage {props.stage} */}
        </div>
      </div>
    </>
  );
}
