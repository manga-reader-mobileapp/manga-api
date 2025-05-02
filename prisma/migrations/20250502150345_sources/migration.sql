/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `source` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `url` to the `manga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `source` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "manga" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "source" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "source_name_key" ON "source"("name");
