/*
  Warnings:

  - You are about to drop the column `name` on the `Language` table. All the data in the column will be lost.
  - You are about to drop the column `displayLanguage` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jaName]` on the table `Language` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[enName]` on the table `Language` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `enName` to the `Language` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jaName` to the `Language` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Language_name_key";

-- AlterTable
ALTER TABLE "Language" DROP COLUMN "name",
ADD COLUMN     "enName" TEXT NOT NULL,
ADD COLUMN     "jaName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "displayLanguage";

-- DropEnum
DROP TYPE "DisplayLanguage";

-- CreateIndex
CREATE UNIQUE INDEX "Language_jaName_key" ON "Language"("jaName");

-- CreateIndex
CREATE UNIQUE INDEX "Language_enName_key" ON "Language"("enName");
