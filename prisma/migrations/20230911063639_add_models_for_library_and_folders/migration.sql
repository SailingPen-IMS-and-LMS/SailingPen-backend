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
CREATE TABLE "Library" (
    "id" SERIAL NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "root_folder_id" INTEGER NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryFolder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "LibraryFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Library_tutor_id_key" ON "Library"("tutor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Library_root_folder_id_key" ON "Library"("root_folder_id");

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "Tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_root_folder_id_fkey" FOREIGN KEY ("root_folder_id") REFERENCES "LibraryFolder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryFolder" ADD CONSTRAINT "LibraryFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "LibraryFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
