/*
  Warnings:

  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_user_id_fkey";

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ALTER COLUMN "student_id" SET DEFAULT (concat('student_', gen_random_uuid()))::TEXT,
ALTER COLUMN "student_id" DROP DEFAULT,
ALTER COLUMN "student_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id");
DROP SEQUENCE "Student_student_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "user_id" SET DEFAULT (concat('user_', gen_random_uuid()))::TEXT,
ALTER COLUMN "user_id" DROP DEFAULT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");
DROP SEQUENCE "User_user_id_seq";

-- CreateTable
CREATE TABLE "Tutor" (
    "tutor_id" TEXT NOT NULL DEFAULT (concat('tutor_', gen_random_uuid()))::TEXT,
    "qualifications" TEXT[],
    "payment_details" JSONB NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("tutor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_user_id_key" ON "Tutor"("user_id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
