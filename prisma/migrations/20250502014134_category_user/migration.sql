/*
  Warnings:

  - Added the required column `userId` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
