-- Drop the one-answer-per-question unique index; multiple_choice stores one row per selected option.
-- DROP INDEX (not DROP CONSTRAINT): the unique was created as a standalone UNIQUE INDEX in the exams
-- migration, which has no pg_constraint entry — a pg_constraint guard silently skips it.
DROP INDEX IF EXISTS "user_answer_session_id_question_id_key";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "user_answer_session_id_question_id_idx" ON "user_answer"("session_id", "question_id");
