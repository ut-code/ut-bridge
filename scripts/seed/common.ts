import { languages } from "./data/languages.ts";
import { universities } from "./data/universities.ts";

import { prisma } from "../../server/config/prisma.ts";

export async function main() {
  const firstUniversity = universities[0];
  if (!firstUniversity) throw new Error("please input universities");
  if (
    await prisma.university.findUnique({
      where: { jaName: firstUniversity.in_ja },
    })
  ) {
    throw new Error("cannot run seed: university already exists");
  }

  for (const lang of languages) {
    await prisma.language.create({
      data: { jaName: lang.in_ja, enName: lang.in_en }, // TODO: make language accept more than one name
    });
  }

  for (const univ of universities) {
    const created = await prisma.university.create({
      data: { jaName: univ.in_ja, enName: univ.in_en },
    });
    for (const campus of univ.campuses) {
      await prisma.campus.create({
        data: {
          jaName: campus.in_ja,
          enName: campus.in_en,
          universityId: created.id,
        },
      });
    }
    for (const div of univ.divisions) {
      await prisma.division.create({
        data: {
          jaName: div.in_ja,
          enName: div.in_en,
          universityId: created.id,
        },
      });
    }
  }
}
