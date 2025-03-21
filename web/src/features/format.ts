import type { CardUser, FullCardUser, FullUser, User } from "common/zod/schema";

export function formatUser(user: FullUser): User {
  return {
    id: user.id,
    imageUrl: user.imageUrl ?? undefined,
    name: user.name,
    gender: user.gender,
    isForeignStudent: user.isForeignStudent,
    grade: user.grade,
    hobby: user.hobby,
    introduction: user.introduction,
    division: user.division.name,
    campus: user.campus.name,
    motherLanguage: user.motherLanguage.jaName,
    fluentLanguages: user.fluentLanguages.map((fl) => fl.language.jaName),
    learningLanguages: user.learningLanguages.map((ll) => ll.language.jaName),
    markedAs: user.markedAs[0]?.kind,
  };
}

export function formatCardUser(user: FullCardUser): CardUser {
  return {
    id: user.id,
    imageUrl: user.imageUrl,
    name: user.name,
    gender: user.gender, //TODO:prismaのenumと定義したenumが大文字とかで違うため、このようにした
    isForeignStudent: user.isForeignStudent,
    grade: user.grade,
    campus: user.campus.name,
    motherLanguage: user.motherLanguage.jaName,
    fluentLanguages: user.fluentLanguages.map((fl) => fl.language.jaName),
    learningLanguages: user.learningLanguages.map((ll) => ll.language.jaName),
    marker: user.markedAs[0]?.kind,
  };
}
