"use client";

import { useEffect, useState } from "react";
import { client } from "@/client.ts";

export function useUniversitySpecificData(universityId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<{ id: string; jaName: string; enName: string }[] | null>(null);
  const [divisions, setDivisions] = useState<{ id: string; jaName: string; enName: string }[] | null>(null);

  useEffect(() => {
    async function go() {
      if (!universityId) return;
      setLoading(true);
      const campusRes = await client.campus.$get({ query: { id: universityId } });
      const divisionRes = await client.division.$get({ query: { id: universityId } });
      if (!campusRes.ok || !divisionRes.ok) {
        throw new Error("キャンパスまたは学部データの取得に失敗しました");
      }
      const campuses = await campusRes.json();
      const divisions = await divisionRes.json();
      setCampuses(campuses);
      setDivisions(divisions);
      setLoading(false);
    }
    go();
  }, [universityId]);

  return { campuses, divisions, loading };
}
