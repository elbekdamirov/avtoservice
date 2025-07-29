-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "regionsId" INTEGER,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_regionsId_fkey" FOREIGN KEY ("regionsId") REFERENCES "Regions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
