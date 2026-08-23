import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {apiError, apiSuccess} from "@/utils/types/api-routes"
import {NextRequest} from "next/server"
import {v4 as uuidv4} from "uuid"
import {Prisma} from "@/generated/index"

export async function POST(req: NextRequest) {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const body = await req.json()
        const {examId} = body as {examId: string}

        if (!examId) throw new Error("Exam ID is required")

        const exam = await prisma.exam.findUnique({
            where: {id: examId},
            include: {
                product: true,
                tags: {include: {tag: true}},
            },
        })

        if (!exam) throw new Error("Tryout not found")
        if (!exam.product) throw new Error("Tryout has no associated product")

        const isFree = exam.tags.some((t) => t.tag.name.toLowerCase() === "free")
        if (!isFree) throw new Error("This tryout is not free to claim")

        const existing = await prisma.entitlement.findFirst({
            where: {
                user_id: session.user.id,
                product_id: exam.product.id,
            },
        })

        if (existing) {
            return apiSuccess(existing, "Already owned", 200)
        }

        const orderId = uuidv4()
        const order = await prisma.order.create({
            data: {
                midtrans_order_id: orderId,
                user_id: session.user.id,
                gross_amount: 0,
                midtrans_request: Prisma.JsonNull,
                midtrans_token: null,
                midtrans_redirect: null,
                status: "success",
                paid_at: new Date(),
            },
        })

        const entitlement = await prisma.entitlement.create({
            data: {
                user_id: session.user.id,
                product_id: exam.product.id,
                order_id: order.id,
            },
        })

        return apiSuccess(entitlement, "Tryout claimed successfully", 200)
    } catch (error) {
        return apiError(error)
    }
}