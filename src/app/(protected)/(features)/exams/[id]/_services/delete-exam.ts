"use server"

import {Exam} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"
import {authServer} from "@/lib/auth-server"
import {revalidatePath} from "next/cache"

export async function deleteExam(id: string): Promise<ServerResult<Exam>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const exam = (await prisma.exam.delete({
            where: {id},
        })) as Exam

        revalidatePath("/exams")
        return {success: true, data: exam, message: "Exam deleted successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
