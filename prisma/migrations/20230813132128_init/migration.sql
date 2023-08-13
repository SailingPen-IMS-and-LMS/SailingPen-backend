/*
  Warnings:

  - Added the required column `tutor_id` to the `TutionClass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "student_id" SET DEFAULT (concat('student_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "subject_id" SET DEFAULT (concat('class_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "TutionClass" ADD COLUMN     "tutor_id" TEXT NOT NULL,
ALTER COLUMN "class_id" SET DEFAULT (concat('class_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Tutor" ALTER COLUMN "tutor_id" SET DEFAULT (concat('tutor_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "user_id" SET DEFAULT (concat('user_', gen_random_uuid()))::TEXT;

-- AddForeignKey
ALTER TABLE "TutionClass" ADD CONSTRAINT "TutionClass_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "Tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
