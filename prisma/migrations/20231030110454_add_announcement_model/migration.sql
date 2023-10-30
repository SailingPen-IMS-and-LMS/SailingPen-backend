-- AlterTable
ALTER TABLE "Administrator" ALTER COLUMN "admin_id" SET DEFAULT (concat('admin_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "answer_id" SET DEFAULT (concat('answer_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "LessonPack" ALTER COLUMN "id" SET DEFAULT (concat('lp_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "question_id" SET DEFAULT (concat('question_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "quiz_id" SET DEFAULT (concat('quiz_', gen_random_uuid()))::TEXT;

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

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tution_class_id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_tution_class_id_fkey" FOREIGN KEY ("tution_class_id") REFERENCES "TutionClass"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "Tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
