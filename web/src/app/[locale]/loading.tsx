import Loading from "@/components/Loading";

export default function Fallback() {
  return <Loading stage="/[locale]/loading.tsx" />;
}
