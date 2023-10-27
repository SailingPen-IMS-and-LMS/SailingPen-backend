-- AlterTable
ALTER TABLE "Administrator" ALTER COLUMN "admin_id" SET DEFAULT (concat('admin_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "LessonPack" ALTER COLUMN "id" SET DEFAULT (concat('lp_', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "weeklySessionId" TEXT;

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
CREATE TABLE "WeeklySession" (
    "id" TEXT NOT NULL DEFAULT (concat('ws_', gen_random_uuid()))::TEXT,
    "video_url" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tution_class_id" TEXT NOT NULL,

    CONSTRAINT "WeeklySession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_weeklySessionId_fkey" FOREIGN KEY ("weeklySessionId") REFERENCES "WeeklySession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklySession" ADD CONSTRAINT "WeeklySession_tution_class_id_fkey" FOREIGN KEY ("tution_class_id") REFERENCES "TutionClass"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;
