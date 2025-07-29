-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "plate_number" VARCHAR(30) NOT NULL,
    "vin_number" VARCHAR(30) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "year" VARCHAR(4) NOT NULL,
    "current_owner_id" INTEGER,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_current_owner_id_fkey" FOREIGN KEY ("current_owner_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
