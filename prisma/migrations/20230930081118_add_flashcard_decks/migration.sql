/*
  Warnings:

  - You are about to drop the column `studentId` on the `FlashcardDeck` table. All the data in the column will be lost.
  - You are about to drop the column `tutorId` on the `FlashcardDeck` table. All the data in the column will be lost.
  - Made the column `description` on table `FlashcardDeck` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FlashcardDeck" DROP CONSTRAINT "FlashcardDeck_student_id_fkey";

-- DropForeignKey
ALTER TABLE "FlashcardDeck" DROP CONSTRAINT "FlashcardDeck_tutor_id_fkey";

-- AlterTable
ALTER TABLE "Administrator" ALTER COLUMN "admin_id" SET DEFAULT (concat('admin_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "FlashcardDeck" DROP COLUMN "studentId",
DROP COLUMN "tutorId",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "student_id" DROP NOT NULL,
ALTER COLUMN "tutor_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "student_id" SET DEFAULT (concat('student_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Subject" ALTER COLUMN "subject_id" SET DEFAULT (concat('subject_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "SubjectStream" ALTER COLUMN "subject_stream_id" SET DEFAULT (concat('st_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "TutionClass" ALTER COLUMN "class_id" SET DEFAULT (concat('class_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Tutor" ALTER COLUMN "tutor_id" SET DEFAULT (concat('tutor_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "user_id" SET DEFAULT (concat('user_', gen_random_uuid()))::TEXT;

-- AddForeignKey
ALTER TABLE "FlashcardDeck" ADD CONSTRAINT "FlashcardDeck_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashcardDeck" ADD CONSTRAINT "FlashcardDeck_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "Tutor"("tutor_id") ON DELETE SET NULL ON UPDATE CASCADE;
