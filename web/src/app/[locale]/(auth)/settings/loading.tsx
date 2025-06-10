import Loading from "@/components/Loading.tsx";

export default function Fallback() {
  return <Loading stage="/[locale]/(auth)/settings/loading.tsx" />;
}
