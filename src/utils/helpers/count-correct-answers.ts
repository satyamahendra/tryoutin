import prisma from "@/lib/prisma/client"

export async function countCorrectAnswers(sessionId: string): Promise<number> {
    const result = await prisma.userAnswer.count({
        where: {
            session_id: sessionId,
            option: {is_correct: true},
        },
    })
    return result
}
