"use client"

import {Button} from "@/components/ui/button"
import {handleClientError} from "@/utils/helpers/handle-client-errors"
import {useMutation, useQuery} from "@tanstack/react-query"
import axios from "axios"
import {toast} from "sonner"

const ProductItem = () => {
    const {mutate, isPending} = useMutation({
        mutationFn: async (data: any) => await axios.post("/api/midtrans/token", data),
        onSuccess: (data) => {
            window.snap.pay(data.data.data.token, {
                onSuccess: () => toast.success("Payment successful!"),
                onError: () => toast.error("Something went wrong."),
            })
        },
        onError: (error) => {
            toast.error(handleClientError(error))
        },
    })

    const {data: order, refetch: refetchOrder} = useQuery({
        queryKey: ["order"],
        queryFn: async (data: any) => await axios.get("/api/midtrans/status?order_id=ee1c8a10-0342-4db8-939b-a254b5155be7"),
        enabled: false,
    })

    const handleCheckOrderStatus = async () => {
        const res = await refetchOrder()
        console.log(res.data?.data.data.transaction_status === "settlement")
    }

    return (
        <div>
            <h1>
                <Button disabled={isPending} onClick={() => mutate({id_product: "a654e415-f7c8-43cd-96dd-e6064abae30e"})}>
                    {isPending ? "Loading..." : "Checkout"}
                </Button>
                <Button onClick={handleCheckOrderStatus}>Check Status</Button>
            </h1>
        </div>
    )
}

export default ProductItem
