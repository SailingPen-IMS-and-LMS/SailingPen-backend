-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "attendance_date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Enrollment" ALTER COLUMN "enrolled_date_time" SET DEFAULT CURRENT_TIMESTAMP;

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
