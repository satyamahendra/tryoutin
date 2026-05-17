import {TokenParameter} from "@/lib/midtrans/types/midtrans"
import {snap} from "@/lib/midtrans/snap"
import {authServer} from "@/lib/auth-server"
import {apiError, apiSuccess} from "@/utils/types/api-routes"
import {NextRequest} from "next/server"
import {v4 as uuidv4} from "uuid"
import prisma from "@/lib/prisma/client"

export async function POST(req: NextRequest) {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const body = await req.json()

        const product = await prisma.product.findUnique({
            where: {
                id: body.id_product,
            },
            include: {
                bundleItems: {
                    select: {
                        product: {
                            select: {
                                id: true,
                                price: true,
                                name: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        })
        if (!product) throw new Error("Product not found")

        let itemDetails = [
            {
                id: `${product.type === "bundle" ? "bundle_" : ""}${product.id}`,
                price: product.price,
                quantity: 1,
                name: product.name,
            },
        ]
        if (product.type === "bundle") {
            const bundleItems = product.bundleItems.map((item) => ({
                id: `${item.product.id}`,
                price: item.product.price,
                quantity: 1,
                name: item.product.name,
            }))
            itemDetails.push(...bundleItems)
        }

        const orderId = uuidv4()
        const parameter: TokenParameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: product.price,
            },
            credit_card: {secure: true},
            item_details: itemDetails,
            customer_details: {
                first_name: session?.user?.name,
                email: session?.user?.email,
            },
        }

        const data = await snap.createTransaction(parameter)

        const order = await prisma.order.create({
            data: {
                midtrans_order_id: orderId,
                user_id: session.user.id,
                grossAmount: product.price,
                midtrans_request: parameter,
            },
        })

        return apiSuccess({...data, order}, "Token created successfully", 200)
    } catch (error) {
        return apiError(error)
    }
}
