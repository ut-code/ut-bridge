import { languages } from "./data/languages.ts";
import { universities } from "./data/universities.ts";

import { prisma } from "../../server/config/prisma.ts";

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
