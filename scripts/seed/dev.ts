import { prisma } from "../../server/config/prisma.ts";
import { users } from "./data/users.ts";
import { randomSelect } from "./lib.ts";

export async function main() {
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
    console.log(newUser);
  }
}
