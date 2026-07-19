-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('multiple_choice', 'single_choice', 'scaled_choice', 'essay');

-- CreateEnum
CREATE TYPE "ExamSessionStatus" AS ENUM ('in_progress', 'completed', 'expired', 'abandoned');

-- CreateEnum
CREATE TYPE "ExamPartSessionStatus" AS ENUM ('not_started', 'in_progress', 'completed', 'expired');

-- CreateTable
CREATE TABLE "tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_tag" (
    "exam_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "exam_tag_pkey" PRIMARY KEY ("exam_id","tag_id")
);

-- CreateTable
CREATE TABLE "exam" (
    "id" TEXT NOT NULL,
    "product_id" TEXT,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration_minutes" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_part" (
    "id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "duration_minutes" INTEGER,
    "passing_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "part_id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'single_choice',
    "question_text" TEXT NOT NULL,
    "question_image" TEXT,
    "explanation" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_option" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_text" TEXT,
    "option_image" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "question_option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "entitlement_id" TEXT,
    "status" "ExamSessionStatus" NOT NULL DEFAULT 'in_progress',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ends_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "total_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_session_part" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "part_id" TEXT NOT NULL,
    "status" "ExamPartSessionStatus" NOT NULL DEFAULT 'not_started',
    "started_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),

    CONSTRAINT "exam_session_part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_answer" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_id" TEXT,
    "answer_text" TEXT,
    "score_awarded" DOUBLE PRECISION,
    "is_graded" BOOLEAN NOT NULL DEFAULT true,
    "graded_by" TEXT,
    "graded_at" TIMESTAMP(3),
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "exam_product_id_key" ON "exam"("product_id");

-- CreateIndex
CREATE INDEX "exam_part_exam_id_idx" ON "exam_part"("exam_id");

-- CreateIndex
CREATE INDEX "question_part_id_idx" ON "question"("part_id");

-- CreateIndex
CREATE INDEX "question_option_question_id_idx" ON "question_option"("question_id");

-- CreateIndex
CREATE INDEX "exam_session_user_id_idx" ON "exam_session"("user_id");

-- CreateIndex
CREATE INDEX "exam_session_exam_id_idx" ON "exam_session"("exam_id");

-- CreateIndex
CREATE INDEX "exam_session_user_id_status_idx" ON "exam_session"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "exam_session_part_session_id_part_id_key" ON "exam_session_part"("session_id", "part_id");

-- CreateIndex
CREATE INDEX "user_answer_is_graded_idx" ON "user_answer"("is_graded");

-- CreateIndex
CREATE UNIQUE INDEX "user_answer_session_id_question_id_key" ON "user_answer"("session_id", "question_id");

-- AddForeignKey
ALTER TABLE "exam_tag" ADD CONSTRAINT "exam_tag_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_tag" ADD CONSTRAINT "exam_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam" ADD CONSTRAINT "exam_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_part" ADD CONSTRAINT "exam_part_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "exam_part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_option" ADD CONSTRAINT "question_option_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_session" ADD CONSTRAINT "exam_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_session" ADD CONSTRAINT "exam_session_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_session" ADD CONSTRAINT "exam_session_entitlement_id_fkey" FOREIGN KEY ("entitlement_id") REFERENCES "entitlement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_session_part" ADD CONSTRAINT "exam_session_part_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "exam_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_session_part" ADD CONSTRAINT "exam_session_part_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "exam_part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answer" ADD CONSTRAINT "user_answer_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "exam_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answer" ADD CONSTRAINT "user_answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answer" ADD CONSTRAINT "user_answer_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "question_option"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answer" ADD CONSTRAINT "user_answer_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
