-- CreateTable
CREATE TABLE "CarHistory" (
    "id" SERIAL NOT NULL,
    "buyed_at" TIMESTAMP(3) NOT NULL,
    "sold_at" TIMESTAMP(3),
    "ownerId" INTEGER,
    "carId" INTEGER,

    CONSTRAINT "CarHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarHistory" ADD CONSTRAINT "CarHistory_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarHistory" ADD CONSTRAINT "CarHistory_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE SET NULL ON UPDATE CASCADE;
