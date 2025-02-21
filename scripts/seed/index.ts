import { languages } from "./data/languages.ts";
import { universities } from "./data/universities.ts";

import { prisma } from "../../server/config/prisma.ts";
import { users } from "./data/users.ts";

if (
  await prisma.university.findUnique({ where: { name: universities[0].name } })
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
      divisionId: seedDivisions[0].id,
      campusId: seedCampuses[0].id,
      motherLanguageId: seedLanguages[0].id,
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
