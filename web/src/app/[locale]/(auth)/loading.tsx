import Loading from "@/components/Loading";

export default function Fallback() {
  return <Loading stage="/[locale]/(auth)/loading.tsx" />;
}
