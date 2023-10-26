-- AlterTable
ALTER TABLE "Administrator" ALTER COLUMN "admin_id" SET DEFAULT (concat('admin_', gen_random_uuid()))::TEXT;

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

-- CreateTable
CREATE TABLE "StudentBoughtLessonPack" (
    "id" SERIAL NOT NULL,
    "bought_date" TIMESTAMP(3) NOT NULL,
    "student_id" TEXT NOT NULL,
    "lesson_pack_id" TEXT NOT NULL,

    CONSTRAINT "StudentBoughtLessonPack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentBoughtLessonPack" ADD CONSTRAINT "StudentBoughtLessonPack_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBoughtLessonPack" ADD CONSTRAINT "StudentBoughtLessonPack_lesson_pack_id_fkey" FOREIGN KEY ("lesson_pack_id") REFERENCES "LessonPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
