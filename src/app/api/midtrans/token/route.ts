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
                bundle_items: {
                    select: {
                        product: {
                            select: {
                                id: true,
                                price_actual: true,
                                name: true,
                                type: true,
                            },
                        },
                    },
                },
            },
        })
        if (!product) throw new Error("Product not found")

        const itemDetails = [
            {
                id: `${product.type === "bundle" ? "bundle_" : ""}${product.id}`,
                price: product.price_actual,
                quantity: 1,
                name: product.name,
            },
        ]
        if (product.type === "bundle") {
            const bundleItems = product.bundle_items.map((item) => ({
                id: `${item.product.id}`,
                price: item.product.price_actual,
                quantity: 1,
                name: item.product.name,
            }))
            itemDetails.push(...bundleItems)
        }

        const orderId = uuidv4()
        const parameter: TokenParameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: product.price_actual,
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
                gross_amount: product.price_actual,
                midtrans_request: parameter,
                midtrans_token: data.token,
                midtrans_redirect: data.redirect_url,
            },
        })

        return apiSuccess({...data, order}, "Token created successfully", 200)
    } catch (error) {
        return apiError(error)
    }
}
