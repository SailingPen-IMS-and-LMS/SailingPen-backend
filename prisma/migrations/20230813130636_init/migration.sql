-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "student_id" SET DEFAULT (concat('student_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Tutor" ALTER COLUMN "tutor_id" SET DEFAULT (concat('tutor_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "user_id" SET DEFAULT (concat('user_', gen_random_uuid()))::TEXT;

-- CreateTable
CREATE TABLE "Subject" (
    "subject_id" TEXT NOT NULL DEFAULT (concat('class_', gen_random_uuid()))::TEXT,
    "subject_name" TEXT NOT NULL,
    "subject_description" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "TutionClass" (
    "class_id" TEXT NOT NULL DEFAULT (concat('class_', gen_random_uuid()))::TEXT,
    "class_description" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "schedule" JSONB,

    CONSTRAINT "TutionClass_pkey" PRIMARY KEY ("class_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_subject_name_key" ON "Subject"("subject_name");

-- AddForeignKey
ALTER TABLE "TutionClass" ADD CONSTRAINT "TutionClass_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;
