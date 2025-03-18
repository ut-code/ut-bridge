import type { FlatCardUser, FlatUser, StructuredCardUser, StructuredUser } from "common/zod/schema";

export function formatUser(user: StructuredUser): FlatUser {
  return {
    id: user.id,
    name: user.name,
    gender: user.gender,
    imageUrl: user.imageUrl ?? undefined,
    grade: user.grade,
    hobby: user.hobby,
    introduction: user.introduction,
    isForeignStudent: user.isForeignStudent,

    university: user.university.name,
    division: user.division.name,
    campus: user.campus.name,

    motherLanguage: user.motherLanguage.name,
    fluentLanguages: user.fluentLanguages.map((fl) => fl.language.name),
    learningLanguages: user.learningLanguages.map((ll) => ll.language.name),

    markedAs: user.markedAs[0]?.kind,
  };
}
export function formatCardUser(user: StructuredCardUser): FlatCardUser {
  return {
    id: user.id,
    name: user.name,
    gender: user.gender,
    imageUrl: user.imageUrl ?? undefined,
    grade: user.grade,
    isForeignStudent: user.isForeignStudent,

    campus: user.campus.name,

    motherLanguage: user.motherLanguage.name,
    fluentLanguages: user.fluentLanguages.map((fl) => fl.language.name),
    learningLanguages: user.learningLanguages.map((ll) => ll.language.name),

    markedAs: user.markedAs[0]?.kind,
  };
}
