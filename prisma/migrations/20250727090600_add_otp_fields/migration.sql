-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "otp_code" TEXT,
ADD COLUMN     "otp_expires_at" TIMESTAMP(3);
