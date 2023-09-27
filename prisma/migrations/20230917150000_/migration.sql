-- AlterTable
ALTER TABLE "Administrator" ALTER COLUMN "admin_id" SET DEFAULT (concat('admin_', gen_random_uuid()))::TEXT;

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

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "folder_id" INTEGER NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "LibraryFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
