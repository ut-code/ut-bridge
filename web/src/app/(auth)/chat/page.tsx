export default function Page() {
  return (
    <div>
      <button
        onClick={() => {
          client.samples.login.$get();
        }}
      >
        click me!
      </button>
    </div>
  );
}
