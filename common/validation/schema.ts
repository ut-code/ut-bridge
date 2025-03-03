import * as v from "valibot";

// Enums
export const GenderEnum = v.picklist(["male", "female", "other"]);
export const DisplayLanguageEnum = v.picklist(["japanese", "english"]);
export const GradeEnum = v.picklist(["B1", "B2", "B3", "B4", "M1", "M2", "D1", "D2", "D3"]);
export const ExchangeSchema = v.picklist(["all", "exchange", "japanese"]);
export const MarkerSchema = v.picklist(["blocked", "favorite"]);

// Common Schemas
export const HobbySchema = v.pipe(v.string(), v.maxLength(25, "趣味は25文字以下です"));
export const IntroductionSchema = v.pipe(v.string(), v.maxLength(225, "コメントは225文字以下です"));

const LanguageSchema = v.object({
  id: v.string(),
  name: v.string(),
});

const FluentLanguageSchema = v.object({
  language: LanguageSchema,
});
const LearningLanguageSchema = v.object({
  language: LanguageSchema,
});

// User Base Schema
const BaseUserSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  gender: GenderEnum,
  isForeignStudent: v.boolean(),
  displayLanguage: DisplayLanguageEnum,
  grade: GradeEnum,
  hobby: HobbySchema,
  introduction: IntroductionSchema,
});

// UserSchema は、 UI で表示する用のフラットなデータ
export const UserSchema = v.object({
  ...BaseUserSchema.entries,
  imageUrl: v.nullable(v.string()),
  division: v.string(),
  campus: v.string(),
  motherLanguage: v.string(),
  fluentLanguages: v.array(v.string()),
  learningLanguages: v.array(v.string()),
  markedAs: v.optional(MarkerSchema),
});

export const CreateUserSchema = v.object({
  ...BaseUserSchema.entries,
  guid: v.string(),
  imageUrl: v.nullable(v.string()),
  universityId: v.string(),
  divisionId: v.string(),
  campusId: v.string(),
  motherLanguageId: v.string(),
  fluentLanguageIds: v.array(v.string()),
  learningLanguageIds: v.array(v.string()),
});

export const SeedUserSchema = v.object({
  //nullがいっぱいなのはこれだけ
  id: v.pipe(v.string(), v.uuid()),
  guid: v.string(),
  imageUrl: v.nullable(v.string()),
  name: v.string(),
  gender: GenderEnum,
  isForeignStudent: v.boolean(),
  displayLanguage: DisplayLanguageEnum,
  grade: GradeEnum,
  hobby: HobbySchema,
  introduction: IntroductionSchema,
  divisionId: v.nullable(v.string()),
  campusId: v.nullable(v.string()),
  motherLanguageId: v.nullable(v.string()),
  fluentLanguageIds: v.nullable(v.array(v.string())),
  learningLanguageIds: v.nullable(v.array(v.string())),
});

// export const CardUserSchema = BaseUserSchema.extend({
//   imageUrl: v.string().nullable(),
//   campus: v.string(),
//   motherLanguage: v.string(),
//   fluentLanguages: v.array(v.string()),
//   learningLanguages: v.array(v.string()),
// });

export const CardUserSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  gender: GenderEnum,
  isForeignStudent: v.boolean(),
  imageUrl: v.nullable(v.string()),
  campus: v.string(),
  grade: GradeEnum,
  motherLanguage: v.string(),
  fluentLanguages: v.array(v.string()),
  learningLanguages: v.array(v.string()),
  marker: v.optional(MarkerSchema),
});

export const FullCardUserSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  gender: GenderEnum,
  isForeignStudent: v.boolean(),
  imageUrl: v.nullable(v.string()),
  campus: v.object({
    name: v.string(),
  }),
  grade: GradeEnum,
  motherLanguage: LanguageSchema,
  fluentLanguages: v.array(FluentLanguageSchema),
  learningLanguages: v.array(LearningLanguageSchema),
  markedAs: v.array(v.object({ kind: MarkerSchema })),
});

// Additional Schemas

const DivisionSchema = v.object({
  id: v.string(),
  name: v.string(),
  universityId: v.string(),
});

const CampusSchema = v.object({
  id: v.string(),
  name: v.string(),
  universityId: v.string(),
});

// Full* は、 Prisma からもってきた構造化データ
export const FullUserSchema = v.object({
  ...BaseUserSchema.entries,
  guid: v.string(),
  imageUrl: v.nullable(v.string()),
  divisionId: v.string(),
  division: DivisionSchema,
  campusId: v.string(),
  campus: CampusSchema,
  motherLanguageId: v.string(),
  motherLanguage: LanguageSchema,
  fluentLanguages: v.array(FluentLanguageSchema),
  learningLanguages: v.array(LearningLanguageSchema),
  markedAs: v.array(v.object({ kind: MarkerSchema })),
});

// Types
export type User = v.InferOutput<typeof UserSchema>;
export type CreateUser = v.InferOutput<typeof CreateUserSchema>;
export type SeedUser = v.InferOutput<typeof SeedUserSchema>;
export type FullCardUser = v.InferOutput<typeof FullCardUserSchema>;
export type CardUser = v.InferOutput<typeof CardUserSchema>;
export type FullUser = v.InferOutput<typeof FullUserSchema>;
export type Marker = v.InferOutput<typeof MarkerSchema>;
export type Exchange = v.InferOutput<typeof ExchangeSchema>;
