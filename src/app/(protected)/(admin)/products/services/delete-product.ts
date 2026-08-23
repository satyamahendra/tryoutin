"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {ServerResult} from "@/utils/types/server-action"
import {Product} from "@/generated/index"
import {requireAbility} from "@/utils/helpers/has-ability-server"
import {handleServerError} from "@/utils/helpers/handle-server-errors"

export async function deleteProduct(id: string): Promise<ServerResult<Product>> {
    try {
        await requireAbility(["manage products"])

        const product = (await prisma.product.delete({
            where: {id},
        })) as Product

        revalidatePath("/products")
        return {success: true, data: product, message: `Product deleted successfully`}
    } catch (error) {
        return handleServerError(error)
    }
}
