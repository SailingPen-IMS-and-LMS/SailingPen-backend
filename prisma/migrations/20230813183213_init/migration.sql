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
CREATE TABLE "Administrator" (
    "admin_id" TEXT NOT NULL DEFAULT (concat('admin_', gen_random_uuid()))::TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Administrator_pkey" PRIMARY KEY ("admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_user_id_key" ON "Administrator"("user_id");

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
