"use server"

import {Exam} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"
import {authServer} from "@/lib/auth-server"
import {examSchema, type ExamSchema} from "../_utils/schema"
import {revalidatePath} from "next/cache"

export async function upsertExam(data: ExamSchema): Promise<ServerResult<Pick<Exam, "id">>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const parsed = examSchema.parse(data)

        const {id, title, description, category, duration_minutes, product_id, tags, parts} = parsed

        const partsPayload = parts.map((part, pi) => ({
            name: part.name ?? "",
            order_index: pi,
            passing_score: part.passing_score ?? 0,
            duration_minutes: part.duration_minutes ?? null,
            questions: {
                create: part.questions.map((q, qi) => ({
                    type: (q.type ?? "single_choice") as "single_choice" | "multiple_choice" | "scaled_choice" | "essay",
                    question_text: q.question_text ?? "",
                    question_image: q.question_image ?? null,
                    explanation: q.explanation ?? null,
                    order_index: qi,
                    options: {
                        create: q.options.map((o, oi) => ({
                            option_text: o.option_text ?? null,
                            option_image: o.option_image ?? null,
                            score: o.score ?? 0,
                            is_correct: o.is_correct ?? false,
                            order_index: oi,
                        })),
                    },
                })),
            },
        }))

        let exam: Pick<Exam, "id">

        const tagsPayload = tags.map((t) => ({
            tag_id: t.value,
        }))

        if (id) {
            exam = await prisma.$transaction(async (tx) => {
                await tx.examPart.deleteMany({where: {exam_id: id}})
                await tx.examTag.deleteMany({where: {exam_id: id}})

                return tx.exam.update({
                    where: {id},
                    data: {
                        title,
                        description,
                        category,
                        duration_minutes,
                        product_id: product_id?.value ?? null,
                        tags: {
                            create: tagsPayload,
                        },
                        parts: {
                            create: partsPayload,
                        },
                    },
                    select: {id: true},
                })
            })
        } else {
            exam = await prisma.$transaction(async (tx) => {
                return tx.exam.create({
                    data: {
                        title,
                        description,
                        category,
                        duration_minutes,
                        product_id: product_id?.value ?? null,
                        tags: {
                            create: tagsPayload,
                        },
                        parts: {
                            create: partsPayload,
                        },
                    },
                    select: {id: true},
                })
            })
        }

        revalidatePath("/exams")

        const action = id ? "updated" : "created"
        return {success: true, data: exam, message: `Exam ${action} successfully`}
    } catch (error) {
        return handleServerError(error)
    }
}
