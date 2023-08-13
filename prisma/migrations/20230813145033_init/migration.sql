/*
  Warnings:

  - You are about to drop the column `subject_stream_id` on the `Subject` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_subject_stream_id_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "student_id" SET DEFAULT (concat('student_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "subject_stream_id",
ALTER COLUMN "subject_id" SET DEFAULT (concat('subject_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "SubjectStream" ALTER COLUMN "subject_stream_id" SET DEFAULT (concat('st_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "TutionClass" ALTER COLUMN "class_id" SET DEFAULT (concat('class_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Tutor" ALTER COLUMN "tutor_id" SET DEFAULT (concat('tutor_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "user_id" SET DEFAULT (concat('user_', gen_random_uuid()))::TEXT;

-- CreateTable
CREATE TABLE "_SubjectToSubjectStream" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SubjectToSubjectStream_AB_unique" ON "_SubjectToSubjectStream"("A", "B");

-- CreateIndex
CREATE INDEX "_SubjectToSubjectStream_B_index" ON "_SubjectToSubjectStream"("B");

-- AddForeignKey
ALTER TABLE "_SubjectToSubjectStream" ADD CONSTRAINT "_SubjectToSubjectStream_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToSubjectStream" ADD CONSTRAINT "_SubjectToSubjectStream_B_fkey" FOREIGN KEY ("B") REFERENCES "SubjectStream"("subject_stream_id") ON DELETE CASCADE ON UPDATE CASCADE;
