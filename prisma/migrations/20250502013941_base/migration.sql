-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderKanban" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manga" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "chapters" INTEGER NOT NULL DEFAULT 0,
    "sourceId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_manga" (
    "id" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_manga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "source_url_key" ON "source"("url");

-- AddForeignKey
ALTER TABLE "manga" ADD CONSTRAINT "manga_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_manga" ADD CONSTRAINT "saved_manga_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_manga" ADD CONSTRAINT "saved_manga_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_manga" ADD CONSTRAINT "saved_manga_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
