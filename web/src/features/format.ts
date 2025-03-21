import type { FlatCardUser, FlatUser, StructuredCardUser, StructuredUser } from "common/zod/schema";

export function formatUser(user: StructuredUser, locale: string): FlatUser {
  const getName = (obj: { jaName: string; enName: string }) => (locale === "ja" ? obj.jaName : obj.enName);

  return {
    id: user.id,
    name: user.name,
    gender: user.gender,
    imageUrl: user.imageUrl ?? undefined,
    grade: user.grade,
    hobby: user.hobby,
    introduction: user.introduction,
    isForeignStudent: user.isForeignStudent,

    university: getName(user.campus.university),
    division: getName(user.division),
    campus: getName(user.campus),

    motherLanguage: user.motherLanguage.jaName,
    fluentLanguages: user.fluentLanguages.map((fl) => getName(fl.language)),
    learningLanguages: user.learningLanguages.map((ll) => getName(ll.language)),

    markedAs: user.markedAs[0]?.kind,
  };
}

export function formatCardUser(user: StructuredCardUser, locale: string): FlatCardUser {
  const getName = (obj: { jaName: string; enName: string }) => (locale === "ja" ? obj.jaName : obj.enName);

  return {
    id: user.id,
    name: user.name,
    gender: user.gender,
    imageUrl: user.imageUrl ?? undefined,
    grade: user.grade,
    isForeignStudent: user.isForeignStudent,

    campus: getName(user.campus),

    motherLanguage: user.motherLanguage.jaName,
    fluentLanguages: user.fluentLanguages.map((fl) => getName(fl.language)),
    learningLanguages: user.learningLanguages.map((ll) => getName(ll.language)),

    markedAs: user.markedAs[0]?.kind,
  };
}
