import { languages } from "./data/languages.ts";
import { universities } from "./data/universities.ts";

import { prisma } from "../../server/config/prisma.ts";
import { users } from "./data/users.ts";

const firstUniversity = universities[0];
if (!firstUniversity) throw new Error("please input universities");
if (await prisma.university.findUnique({ where: { name: firstUniversity.name } })) {
  throw new Error("cannot run seed: university already exists");
}

for (const lang of languages) {
  await prisma.language.create({
    data: { jaName: lang.in_ja, enName: lang.in_en },
  });
}

for (const univ of universities) {
  const created = await prisma.university.create({
    data: { name: univ.name },
  });
  for (const campus of univ.campuses) {
    await prisma.campus.create({
      data: {
        name: campus.name,
        universityId: created.id,
      },
    });
  }
  for (const div of univ.divisions) {
    await prisma.division.create({
      data: {
        name: div.name,
        universityId: created.id,
      },
    });
  }
}

function randomSelect<T>(set: T[]) {
  const rand = set[Math.floor(Math.random() * set.length)];
  if (!rand) throw new Error("randomSelect called on empty list");
  return rand;
}

const seedDivisions = await prisma.division.findMany();
const seedCampuses = await prisma.campus.findMany();
const seedLanguages = await prisma.language.findMany();

for (const user of users) {
  await prisma.user.create({
    data: {
      id: user.id,
      name: user.name,
      gender: user.gender,
      isForeignStudent: user.isForeignStudent,
      grade: user.grade,
      hobby: user.hobby,
      introduction: user.introduction,
      guid: user.guid,
      imageUrl:
        "https://ut-bridge.c692d351b94b9f1f32c04143499cba82.r2.cloudflarestorage.com/uploads/1741071179064-83ik3cexugf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=2c41c4387261a673e923b0bfffd328cf%2F20250304%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20250304T065301Z&X-Amz-Expires=604800&X-Amz-Signature=fad000eb074800834a6aae797bfbe6930d81738e0843c61a48f1c9f8c0a20886&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      divisionId: randomSelect(seedDivisions).id,
      campusId: randomSelect(seedCampuses).id,
      motherLanguageId: randomSelect(seedLanguages).id,
      fluentLanguages: {
        create: seedLanguages.map((lang) => ({
          language: { connect: { id: lang.id } },
        })),
      },
      learningLanguages: {
        create: seedLanguages.map((lang) => ({
          language: { connect: { id: lang.id } },
        })),
      },
    },
  });
}
