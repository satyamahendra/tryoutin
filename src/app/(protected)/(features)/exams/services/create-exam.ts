"use server"

import {Exam} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

export async function createExam(): Promise<ServerResult<Exam>> {
    try {
        const exam = await prisma.exam.create({
            data: {
                title: "Untitled",
                category: "",
            },
        })

        return {
            data: exam,
            message: "Successfully created an exam",
            success: true,
        }
    } catch (error) {
        return handleServerError(error)
    }
}
