import { z } from "zod";

const GenderEnum = z.enum(["male", "female", "other"]);

const DisplayLanguage = z.enum(["japanese", "english"]);

export const HobbySchema = z
  .string()
  // .min(1, { message: "趣味は1文字以上です" })
  .max(25, { message: "趣味は25文字以下です" });
export const IntroductionSchema = z
  .string()
  // .min(2, { message: "コメントは2文字以上です" })
  .max(225, { message: "コメントは225文字以下です" });

export const UserSchema = z.object({
  id: z.string().uuid(),
  guid: z.string(),
  imageUrl: z.string().optional(),
  name: z.string(),
  gender: GenderEnum,
  isForeignStudent: z.boolean(),
  displayLanguage: DisplayLanguage,
  campusId: z.string(),
  grade: z.number(),
  hobby: HobbySchema,
  introduction: IntroductionSchema,
});
