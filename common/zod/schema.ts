import { z } from "zod";

// Enums
export const GenderEnum = z.enum(["male", "female", "other"]);
export const DisplayLanguageEnum = z.enum(["japanese", "english"]);
export const GradeEnum = z.enum(["B1", "B2", "B3", "B4", "M1", "M2", "D1", "D2", "D3"]);
export const ExchangeSchema = z.enum(["all", "exchange", "japanese"]);
export const MarkerSchema = z.enum(["blocked", "favorite"]);

// Common Schemas
export const HobbySchema = z.string().max(25, { message: "趣味は25文字以下です" });
export const IntroductionSchema = z.string().max(225, { message: "コメントは225文字以下です" });

const LanguageSchema = z.object({
  id: z.string(),
  jaName: z.string(),
  enName: z.string(),
});

const FluentLanguageSchema = z.object({
  language: LanguageSchema,
});
const LearningLanguageSchema = z.object({
  language: LanguageSchema,
});

// User Base Schema
const BaseUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  gender: GenderEnum,
  isForeignStudent: z.boolean(),
  grade: GradeEnum,
  hobby: HobbySchema,
  introduction: IntroductionSchema,
});

// UserSchema は、 UI で表示する用のフラットなデータ
export const UserSchema = BaseUserSchema.extend({
  imageUrl: z.string().optional(),
  division: z.string(),
  campus: z.string(),
  motherLanguage: z.string(),
  fluentLanguages: z.array(z.string()),
  learningLanguages: z.array(z.string()),
  markedAs: MarkerSchema.optional(),
});

export const CreateUserSchema = BaseUserSchema.extend({
  guid: z.string(),
  imageUrl: z.string().optional(),
  universityId: z.string(),
  divisionId: z.string(),
  campusId: z.string(),
  motherLanguageId: z.string(),
  fluentLanguageIds: z.array(z.string()),
  learningLanguageIds: z.array(z.string()),
});

export const SeedUserSchema = z.object({
  //nullがいっぱいなのはこれだけ
  id: z.string().uuid(),
  guid: z.string(),
  imageUrl: z.string().nullable(),
  name: z.string(),
  gender: GenderEnum,
  isForeignStudent: z.boolean(),
  grade: GradeEnum,
  hobby: HobbySchema,
  introduction: IntroductionSchema,
  divisionId: z.string().nullable(),
  campusId: z.string().nullable(),
  motherLanguageId: z.string().nullable(),
  fluentLanguageIds: z.array(z.string()).nullable(),
  learningLanguageIds: z.array(z.string()).nullable(),
});

// export const CardUserSchema = BaseUserSchema.extend({
//   imageUrl: z.string().nullable(),
//   campus: z.string(),
//   motherLanguage: z.string(),
//   fluentLanguages: z.array(z.string()),
//   learningLanguages: z.array(z.string()),
// });

export const CardUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  gender: GenderEnum,
  isForeignStudent: z.boolean(),
  imageUrl: z.string().nullable(),
  campus: z.string(),
  grade: GradeEnum,
  motherLanguage: z.string(),
  fluentLanguages: z.array(z.string()),
  learningLanguages: z.array(z.string()),
  marker: MarkerSchema.optional(),
});

export const FullCardUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  gender: GenderEnum,
  isForeignStudent: z.boolean(),
  imageUrl: z.string().nullable(),
  campus: z.object({
    name: z.string(),
  }),
  grade: GradeEnum,
  motherLanguage: LanguageSchema,
  fluentLanguages: z.array(FluentLanguageSchema),
  learningLanguages: z.array(LearningLanguageSchema),
  markedAs: z.array(z.object({ kind: MarkerSchema })),
});

// Additional Schemas

const DivisionSchema = z.object({
  id: z.string(),
  name: z.string(),
  universityId: z.string(),
});

const CampusSchema = z.object({
  id: z.string(),
  name: z.string(),
  universityId: z.string(),
});

// Full* は、 Prisma からもってきた構造化データ
export const FullUserSchema = BaseUserSchema.extend({
  guid: z.string(),
  imageUrl: z.string().nullable(),
  divisionId: z.string(),
  division: DivisionSchema,
  campusId: z.string(),
  campus: CampusSchema,
  motherLanguageId: z.string(),
  motherLanguage: LanguageSchema,
  fluentLanguages: z.array(FluentLanguageSchema),
  learningLanguages: z.array(LearningLanguageSchema),
  markedAs: z.array(z.object({ kind: MarkerSchema })),
});

// Types
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type SeedUser = z.infer<typeof SeedUserSchema>;
export type FullCardUser = z.infer<typeof FullCardUserSchema>;
export type CardUser = z.infer<typeof CardUserSchema>;
export type FullUser = z.infer<typeof FullUserSchema>;
export type Marker = z.infer<typeof MarkerSchema>;
export type Exchange = z.infer<typeof ExchangeSchema>;
