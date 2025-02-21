type User = {
  //TODO: ZodのSchemaと共有する
  id: string;
  guid: string;
  name: string;
  gender: "male" | "female" | "other";
  isForeignStudent: boolean;
  displayLanguage: "japanese" | "english";
  grade: number;
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
    grade: 3,
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
    grade: 4,
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
    grade: 6,
    hobby:
      "アニメでござる。やはりラブライブは最高のエンターテイメントでござるよ。",
    introduction:
      "よろしくでござるよ。それがしは皆様とたくさん交流したいと思っておりまする。ウヒョヒョヒョ",
  },
];
