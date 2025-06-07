import { z } from "zod";

// Enums
export const GenderEnum = z.enum(["male", "female", "other"]);
export const DisplayLanguageEnum = z.enum(["japanese", "english"]);
export const GradeSchema = z.enum(["B1", "B2", "B3", "B4", "M1", "M2", "D1", "D2", "D3"]);
export const ExchangeSchema = z.enum(["all", "exchange", "japanese"]);
export const MarkerSchema = z.enum(["blocked", "favorite"]);

// Common Schemas
export const NAME_MAX_LENGTH = 30;
export const HOBBY_MAX_LENGTH = 2000;
export const INTRO_MAX_LENGTH = 2000;
export const MESSAGE_MAX_LENGTH = 42000;
export const NameSchema = z.string().max(NAME_MAX_LENGTH, { message: `名前は${NAME_MAX_LENGTH}文字以下です` });
export const HobbySchema = z.string().max(HOBBY_MAX_LENGTH, { message: `趣味は${HOBBY_MAX_LENGTH}文字以下です` });
export const IntroductionSchema = z
  .string()
  .max(INTRO_MAX_LENGTH, { message: `コメントは${INTRO_MAX_LENGTH}文字以下です` });
const LanguageSchema = z.object({
  id: z.string().uuid(),
  jaName: z.string(),
  enName: z.string(),
});

const LanguageObjectSchema = z.object({
  language: LanguageSchema,
});
const DivisionSchema = z.object({
  id: z.string().uuid(),
  jaName: z.string(),
  enName: z.string(),
});
const CampusSchema = z.object({
  id: z.string().uuid(),
  jaName: z.string(),
  enName: z.string(),
  university: z.object({
    id: z.string().uuid(),
    jaName: z.string(),
    enName: z.string(),
  }),
});

const BaseUserSchema = z.object({
  id: z.string().uuid(),
  name: NameSchema,
  gender: GenderEnum,
  imageUrl: z.string().optional(),
  isForeignStudent: z.boolean().default(false),
  grade: GradeSchema,

  wantToMatch: z.boolean().default(true),

  hobby: HobbySchema,
  introduction: IntroductionSchema,
});
const FlatUserSchema = BaseUserSchema.extend({
  university: z.string(),
  campus: z.string(),
  division: z.string(),

  motherLanguage: z.string(),
  fluentLanguages: z.array(z.string()),
  learningLanguages: z.array(z.string()),

  markedAs: MarkerSchema.optional(),
});
const StructuredUserSchema = BaseUserSchema.extend({
  imageUrl: z.string().nullable(), // prisma returns NULL
  campus: CampusSchema,
  division: DivisionSchema,

  motherLanguage: LanguageSchema,
  fluentLanguages: z.array(LanguageObjectSchema),
  learningLanguages: z.array(LanguageObjectSchema),

  markedAs: z.array(z.object({ kind: MarkerSchema })),
});
export const CreateUserSchema = BaseUserSchema.omit({ id: true }).extend({
  universityId: z.string().uuid(),
  campusId: z.string().uuid(),
  divisionId: z.string().uuid(),

  motherLanguageId: z.string().uuid(),
  fluentLanguageIds: z.array(z.string().uuid()),
  learningLanguageIds: z.array(z.string().uuid()),

  // Email fields
  customEmail: z.string().email().optional(),
  allowNotifications: z.boolean().default(true),
  allowPeriodicNotifications: z.boolean().default(true),
});
export const Part1RegistrationSchema = CreateUserSchema.omit({
  hobby: true,
  introduction: true,
  isForeignStudent: true,
  motherLanguageId: true,
  fluentLanguageIds: true,
  learningLanguageIds: true,
});
export const SeedUserSchema = CreateUserSchema.partial();

// type-only schemas because Omit<Omit<... is ugly as hell
// TODO: hobby も自己紹介もいらないの？
const StructuredCardUserSchema = StructuredUserSchema.omit({
  division: true,
  hobby: true,
  introduction: true,
});
const FlatCardUserSchema = FlatUserSchema.omit({
  university: true,
  division: true,
  hobby: true,
  introduction: true,
});

// Types
export type BaseUser = z.infer<typeof BaseUserSchema>;
export type FlatUser = z.infer<typeof FlatUserSchema>;
export type StructuredUser = z.infer<typeof StructuredUserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type StructuredCardUser = z.infer<typeof StructuredCardUserSchema>;
export type FlatCardUser = z.infer<typeof FlatCardUserSchema>;

export type Marker = z.infer<typeof MarkerSchema>;
export type Exchange = z.infer<typeof ExchangeSchema>;

// only user in seed
export type SeedUser = z.infer<typeof SeedUserSchema>;

export type MYDATA = Omit<StructuredUser, "university"> & {
  // because these are unsafe to share across users
  defaultEmail: string | null;
  customEmail: string | null;
  allowNotifications: boolean;
  allowPeriodicNotifications: boolean;
};
