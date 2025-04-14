import { prisma } from "../../server/config/prisma.ts";
import { users } from "./data/users.ts";
import { randomSelect } from "./lib.ts";

function nullthrows<T>(val: T | null | undefined): T {
  if (val == null) throw new Error(`value is nullish: ${val}`);
  return val;
}

export async function main() {
  const seedDivisions = await prisma.division.findMany();
  const seedCampuses = await prisma.campus.findMany();
  const seedLanguages = await prisma.language.findMany();

  for (const user of users) {
    const newUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        guid: crypto.randomUUID(),
        name: nullthrows(user.name),
        gender: nullthrows(user.gender),
        isForeignStudent: nullthrows(user.isForeignStudent),
        grade: nullthrows(user.grade),
        hobby: nullthrows(user.hobby),
        introduction: nullthrows(user.introduction),
        imageUrl: "https://ut-bridge-user-image.utcode.net/ut-bridge-user-image/uploads/Group%20164.png",
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
}
