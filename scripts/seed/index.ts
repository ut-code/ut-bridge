import { languages } from "./data/languages.ts";
import { universities } from "./data/universities.ts";

import { prisma } from "../../server/config/prisma.ts";
import { users } from "./data/users.ts";

const firstUniversity = universities[0];
if (!firstUniversity) throw new Error("please input universities");
if (
  await prisma.university.findUnique({ where: { name: firstUniversity.name } })
) {
  throw new Error("cannot run seed: university already exists");
}

for (const lang of languages) {
  await prisma.language.create({
    data: { name: lang.in_ja }, // TODO: make language accept more than one name
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
  const newUser = await prisma.user.create({
    data: {
      id: user.id,
      name: user.name,
      gender: user.gender,
      isForeignStudent: user.isForeignStudent,
      displayLanguage: user.displayLanguage,
      grade: user.grade,
      hobby: user.hobby,
      introduction: user.introduction,
      guid: user.guid,
      imageUrl: user.imageUrl,
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
  console.log(newUser);
}
