import type { SeedUser } from "common/zod/schema.ts";
export const users: SeedUser[] = [
  {
    id: self.crypto.randomUUID(),
    guid: self.crypto.randomUUID(),
    name: "Hanako Suzuki",
    gender: "male",
    isForeignStudent: false,
    displayLanguage: "japanese",
    grade: "B3",
    hobby: "Soccer",
    introduction: "Nice to meet you!",
  },
  {
    id: self.crypto.randomUUID(),
    guid: self.crypto.randomUUID(),
    name: "John Doe",
    gender: "male",
    isForeignStudent: true,
    displayLanguage: "english",
    grade: "M2",
    hobby: "Soccer",
    introduction: "Hello!",
  },
  {
    id: self.crypto.randomUUID(),
    guid: self.crypto.randomUUID(),
    name: "片桐門左衛門",
    gender: "male",
    isForeignStudent: false,
    displayLanguage: "japanese",
    grade: "D3",
    hobby:
      "アニメでござる。やはりラブライブは最高のエンターテイメントでござるよ。",
    introduction:
      "よろしくでござるよ。それがしは皆様とたくさん交流したいと思っておりまする。ウヒョヒョヒョ",
  },
];
