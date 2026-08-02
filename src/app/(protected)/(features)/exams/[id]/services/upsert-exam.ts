"use server"

import {Exam} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"
import {authServer} from "@/lib/auth-server"
import {examSchema, type ExamSchema} from "../utils/schema"
import {revalidatePath} from "next/cache"

export async function upsertExam(data: ExamSchema): Promise<ServerResult<Pick<Exam, "id">>> {
    console.group(data)
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const parsed = examSchema.parse(data)

        const {id, title, description, category, product_id, tags, parts} = parsed

        const tagsPayload = tags.map((t) => ({tag_id: t.value}))

        let exam: Pick<Exam, "id">

        if (id) {
            exam = await prisma.$transaction(
                async (tx) => {
                    const updated = await tx.exam.update({
                        where: {id},
                        data: {
                            title,
                            description,
                            category,
                            product_id: product_id?.value ?? null,
                        },
                        select: {id: true},
                    })

                    // --- Tags: simple diff, no children to preserve ---
                    const existingTags = await tx.examTag.findMany({
                        where: {exam_id: id},
                        select: {tag_id: true},
                    })
                    const incomingTagIds = new Set(tagsPayload.map((t) => t.tag_id))
                    const existingTagIds = new Set(existingTags.map((t) => t.tag_id))

                    const tagIdsToDelete = [...existingTagIds].filter((tid) => !incomingTagIds.has(tid))
                    const tagsToCreate = tagsPayload.filter((t) => !existingTagIds.has(t.tag_id))

                    if (tagIdsToDelete.length) {
                        await tx.examTag.deleteMany({where: {exam_id: id, tag_id: {in: tagIdsToDelete}}})
                    }
                    if (tagsToCreate.length) {
                        await tx.examTag.createMany({data: tagsToCreate.map((t) => ({...t, exam_id: id}))})
                    }

                    // --- Fetch current parts/questions/options structure for diffing ---
                    const existingParts = await tx.examPart.findMany({
                        where: {exam_id: id},
                        select: {
                            id: true,
                            questions: {
                                select: {
                                    id: true,
                                    options: {select: {id: true}},
                                },
                            },
                        },
                    })

                    const existingPartIds = new Set(existingParts.map((p) => p.id))
                    const incomingPartIds = new Set(parts.filter((p) => p.id).map((p) => p.id as string))

                    // Delete parts that were removed (cascade down manually, bottom-up)
                    const partIdsToDelete = [...existingPartIds].filter((pid) => !incomingPartIds.has(pid))
                    if (partIdsToDelete.length) {
                        await tx.questionOption.deleteMany({where: {question: {part_id: {in: partIdsToDelete}}}})
                        await tx.question.deleteMany({where: {part_id: {in: partIdsToDelete}}})
                        await tx.examPart.deleteMany({where: {id: {in: partIdsToDelete}}})
                    }

                    for (let pi = 0; pi < parts.length; pi++) {
                        const part = parts[pi]
                        const partData = {
                            name: part.name ?? "",
                            order_index: pi,
                            passing_score: part.passing_score ?? 0,
                            duration_minutes: part.duration_minutes ?? null,
                        }

                        let partId: string

                        if (part.id && existingPartIds.has(part.id)) {
                            partId = part.id
                            await tx.examPart.update({where: {id: partId}, data: partData})
                        } else {
                            const created = await tx.examPart.create({
                                data: {...partData, exam_id: id},
                                select: {id: true},
                            })
                            partId = created.id
                        }

                        const existingPartRecord = existingParts.find((p) => p.id === partId)
                        const existingQuestionIds = new Set(existingPartRecord?.questions.map((q) => q.id) ?? [])
                        const incomingQuestionIds = new Set(part.questions.filter((q) => q.id).map((q) => q.id as string))

                        const questionIdsToDelete = [...existingQuestionIds].filter((qid) => !incomingQuestionIds.has(qid))
                        if (questionIdsToDelete.length) {
                            await tx.questionOption.deleteMany({where: {question_id: {in: questionIdsToDelete}}})
                            await tx.question.deleteMany({where: {id: {in: questionIdsToDelete}}})
                        }

                        for (let qi = 0; qi < part.questions.length; qi++) {
                            const q = part.questions[qi]
                            const questionData = {
                                type: (q.type ?? "single_choice") as "single_choice" | "multiple_choice" | "scaled_choice" | "essay",
                                question_text: q.question_text ?? "",
                                question_image: q.question_image ?? null,
                                explanation: q.explanation ?? null,
                                order_index: qi,
                            }

                            let questionId: string

                            if (q.id && existingQuestionIds.has(q.id)) {
                                questionId = q.id
                                await tx.question.update({where: {id: questionId}, data: questionData})
                            } else {
                                const createdQ = await tx.question.create({
                                    data: {...questionData, part_id: partId},
                                    select: {id: true},
                                })
                                questionId = createdQ.id
                            }

                            const existingQuestionRecord = existingPartRecord?.questions.find((eq) => eq.id === questionId)
                            const existingOptionIds = new Set(existingQuestionRecord?.options.map((o) => o.id) ?? [])
                            const incomingOptionIds = new Set(q.options.filter((o) => o.id).map((o) => o.id as string))

                            const optionIdsToDelete = [...existingOptionIds].filter((oid) => !incomingOptionIds.has(oid))
                            if (optionIdsToDelete.length) {
                                await tx.questionOption.deleteMany({where: {id: {in: optionIdsToDelete}}})
                            }

                            for (let oi = 0; oi < q.options.length; oi++) {
                                const o = q.options[oi]
                                const optionData = {
                                    option_text: o.option_text ?? null,
                                    option_image: o.option_image ?? null,
                                    score: o.score ?? 0,
                                    is_correct: o.is_correct ?? false,
                                    order_index: oi,
                                }

                                if (o.id && existingOptionIds.has(o.id)) {
                                    await tx.questionOption.update({where: {id: o.id}, data: optionData})
                                } else {
                                    await tx.questionOption.create({data: {...optionData, question_id: questionId}})
                                }
                            }
                        }
                    }

                    return updated
                },
                {timeout: 30000},
            )
        } else {
            exam = await prisma.$transaction(async (tx) => {
                return tx.exam.create({
                    data: {
                        title,
                        description,
                        category,
                        product_id: product_id?.value ?? null,
                        tags: {create: tagsPayload},
                        parts: {
                            create: parts.map((part, pi) => ({
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
                            })),
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

