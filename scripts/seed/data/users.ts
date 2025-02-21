type User = {
  //TODO: ZodのSchemaと共有する
  id: string;
  guid: string;
  name: string;
  gender: "male" | "female" | "other";
  isForeignStudent: boolean;
  displayLanguage: "japanese" | "english";
  grade: "B1" | "B2" | "B3" | "B4" | "M1" | "M2" | "D1" | "D2" | "D3";
  hobby: string;
  introduction: string;
};
export const users: User[] = [
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
