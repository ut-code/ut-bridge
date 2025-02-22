import type { CardUser, FullCardUser, FullUser, User } from "common/zod/schema";

export function formatUser(user: FullUser): User {
  return {
    id: user.id,
    imageUrl: user.imageUrl,
    name: user.name,
    gender: user.gender as "male" | "female" | "other",
    isForeignStudent: user.isForeignStudent,
    displayLanguage: user.displayLanguage as "japanese" | "english",
    grade: user.grade as
      | "B1"
      | "B2"
      | "B3"
      | "B4"
      | "M1"
      | "M2"
      | "D1"
      | "D2"
      | "D3",
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
    gender: user.gender as "male" | "female" | "other", //TODO:prismaのenumと定義したenumが大文字とかで違うため、このようにした
    isForeignStudent: user.isForeignStudent,
    grade: user.grade as
      | "B1"
      | "B2"
      | "B3"
      | "B4"
      | "M1"
      | "M2"
      | "D1"
      | "D2"
      | "D3",
    campus: user.campus.name,
    motherLanguage: user.motherLanguage.name,
    fluentLanguages: user.fluentLanguages.map((fl) => fl.language.name),
    learningLanguages: user.learningLanguages.map((ll) => ll.language.name),
  };
}
