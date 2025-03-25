export const runtime = "edge";

export default function NotFound() {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <div>
        <h1 className="mb-4 font-bold text-3xl">404 - Page Not Found</h1>
        <p className="text-lg">お探しのページは存在しません。</p>
      </div>
    </div>
  );
}
