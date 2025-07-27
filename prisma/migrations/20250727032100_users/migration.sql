-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WORKER', 'CLIENT', 'OWNER');

-- CreateTable
CREATE TABLE "Admins" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "is_creator" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "activation_link" TEXT,
    "refreshToken" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admins_phone_key" ON "Admins"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Admins_email_key" ON "Admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
