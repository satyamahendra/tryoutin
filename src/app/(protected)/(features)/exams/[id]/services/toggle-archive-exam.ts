"use server"

import {Exam} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"
import {authServer} from "@/lib/auth-server"
import {revalidatePath} from "next/cache"

export async function toggleArchiveExam(id: string): Promise<ServerResult<Exam>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const current = await prisma.exam.findUnique({where: {id}, select: {is_active: true}})
        if (!current) throw new Error("Exam not found")

        const exam = (await prisma.exam.update({
            where: {id},
            data: {is_active: !current.is_active},
        })) as Exam

        revalidatePath("/exams")
        revalidatePath(`/exams/${id}`)
        return {success: true, data: exam, message: `Exam ${exam.is_active ? "activated" : "archived"} successfully`}
    } catch (error) {
        return handleServerError(error)
    }
}
