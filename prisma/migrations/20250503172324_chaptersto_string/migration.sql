-- AlterTable
ALTER TABLE "history" ALTER COLUMN "chapter" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "manga" ALTER COLUMN "chapters" SET DEFAULT '0',
ALTER COLUMN "chapters" SET DATA TYPE TEXT;
