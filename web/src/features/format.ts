import type { CardUser, FullCardUser, FullUser, User } from "common/zod/schema";

export function formatUser(user: FullUser): User {
  return {
    id: user.id,
    imageUrl: user.imageUrl,
    name: user.name,
    gender: user.gender,
    isForeignStudent: user.isForeignStudent,
    displayLanguage: user.displayLanguage,
    grade: user.grade,
    hobby: user.hobby,
    introduction: user.introduction,
    division: user.division.name,
    campus: user.campus.name,
    motherLanguage: user.motherLanguage.name,
    fluentLanguages: user.fluentLanguages.map((fl) => fl.language.name),
    learningLanguages: user.learningLanguages.map((ll) => ll.language.name),
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
    motherLanguage: user.motherLanguage.name,
    fluentLanguages: user.fluentLanguages.map((fl) => fl.language.name),
    learningLanguages: user.learningLanguages.map((ll) => ll.language.name),
  };
}
