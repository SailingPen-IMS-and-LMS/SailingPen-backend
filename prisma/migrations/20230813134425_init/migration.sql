/*
  Warnings:

  - Added the required column `subject_stream_id` to the `Subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "student_id" SET DEFAULT (concat('student_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "subject_stream_id" TEXT NOT NULL,
ALTER COLUMN "subject_id" SET DEFAULT (concat('subject_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "TutionClass" ALTER COLUMN "class_id" SET DEFAULT (concat('class_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Tutor" ALTER COLUMN "tutor_id" SET DEFAULT (concat('tutor_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "user_id" SET DEFAULT (concat('user_', gen_random_uuid()))::TEXT;

-- CreateTable
CREATE TABLE "SubjectStream" (
    "subject_stream_id" TEXT NOT NULL DEFAULT (concat('st_', gen_random_uuid()))::TEXT,
    "stream_name" TEXT NOT NULL,
    "stream_description" TEXT NOT NULL,

    CONSTRAINT "SubjectStream_pkey" PRIMARY KEY ("subject_stream_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubjectStream_stream_name_key" ON "SubjectStream"("stream_name");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_subject_stream_id_fkey" FOREIGN KEY ("subject_stream_id") REFERENCES "SubjectStream"("subject_stream_id") ON DELETE RESTRICT ON UPDATE CASCADE;
