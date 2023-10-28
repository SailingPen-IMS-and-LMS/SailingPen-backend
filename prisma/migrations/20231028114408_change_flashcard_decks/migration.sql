/*
  Warnings:

  - You are about to drop the column `student_id` on the `FlashcardDeck` table. All the data in the column will be lost.
  - Added the required column `tution_class_id` to the `FlashcardDeck` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FlashcardDeck" DROP CONSTRAINT "FlashcardDeck_student_id_fkey";

-- DropIndex
DROP INDEX "FlashcardDeck_student_id_key";

-- AlterTable
ALTER TABLE "Administrator" ALTER COLUMN "admin_id" SET DEFAULT (concat('admin_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "FlashcardDeck" DROP COLUMN "student_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tution_class_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "LessonPack" ALTER COLUMN "id" SET DEFAULT (concat('lp_', gen_random_uuid()))::TEXT;

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

-- AlterTable
ALTER TABLE "WeeklySession" ALTER COLUMN "id" SET DEFAULT (concat('ws_', gen_random_uuid()))::TEXT;

-- AddForeignKey
ALTER TABLE "FlashcardDeck" ADD CONSTRAINT "FlashcardDeck_tution_class_id_fkey" FOREIGN KEY ("tution_class_id") REFERENCES "TutionClass"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;
