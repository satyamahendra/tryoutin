"use client"

import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"
import {PiArrowsClockwise, PiArrowSquareOut, PiCalendarDots, PiCheckCircle, PiCoin, PiHandshake, PiLink, PiMoney, PiReceipt, PiTicket, PiX} from "react-icons/pi"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import {getMyOrder} from "../services/get-my-order"
import {Loader2} from "lucide-react"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {format} from "@/utils/helpers/format-date"
import AnimDiv from "@/components/custom/anim-div"
import axios from "axios"
import {Button} from "@/components/ui/button"
import {toast} from "sonner"
import {useRouter} from "next/navigation"

const MyOrderDetailDrawer = () => {
    const {setParams, getParam} = useQueryParams()
    const queryClient = useQueryClient()
    const {isMobile} = useScreenSize()
    const router = useRouter()
    const view = getParam("view") || ""

    const {data: orderData, isLoading} = useQuery({
        queryKey: ["my-order", view],
        queryFn: () => getMyOrder(view),
        enabled: !!view,
    })

    const order = orderData?.data

    const {refetch: refetchOrder, isLoading: isChecking} = useQuery({
        queryKey: ["my-order-status"],
        queryFn: async () => await axios.get(`/api/midtrans/status?order_id=${order?.midtrans_order_id}`),
        staleTime: 0,
        enabled: false,
    })

    const handleCheckOrderStatus = async () => {
        const res = await refetchOrder()
        if (!res?.isSuccess) return toast.error("Gagal ambil status pesanan")
        queryClient.invalidateQueries({queryKey: ["my-order"]})
        router.refresh()
        return toast.success("Status pesanan berhasil diperbarui")
    }

    const handleCopy = (value: string) => {
        navigator.clipboard.writeText(value)
        toast.success("Disalin ke clipboard")
    }

    const handleOpenUrl = (url: string) => {
        window.open(url, "_blank")
    }

    const handleOpenMidtransSnap = (token: string) => {
        if (!window.snap) return toast.error("Token tidak tersedia.")
        window.snap.pay(token, {
            onSuccess: () => toast.success("Pembayaran berhasil!"),
            onError: () => toast.error("Terjadi kesalahan."),
        })
    }

    const displayData = [
        {label: "ID Pesanan", value: order?.midtrans_order_id, icon: <PiTicket />, handleFn: () => handleCopy(order?.midtrans_order_id ?? "")},
        {label: "Status", value: order?.status, icon: <PiCheckCircle />},
        {label: "Tanggal Pesanan Dibuat", value: order?.created_at ? format(order?.created_at, "dd MMM yyyy HH:mm") : "-", icon: <PiCalendarDots />},
        {label: "Tanggal Pesanan Dibayar", value: order?.paid_at ? format(order?.paid_at, "dd MMM yyyy HH:mm") : "-", icon: <PiHandshake />},
        {
            label: "Tautan Pembayaran",
            value: order?.midtrans_redirect ? (
                <div className="flex items-center gap-2">
                    Buka pembayaran <PiArrowSquareOut />
                </div>
            ) : (
                "Tidak ada tautan pembayaran"
            ),
            icon: <PiLink />,
            handleFn: () => handleOpenUrl(order?.midtrans_redirect ?? ""),
        },
        {label: "Token", value: order?.midtrans_token || "-", icon: <PiCoin />, handleFn: () => handleOpenMidtransSnap(order?.midtrans_token ?? "")},
        {label: "Jumlah Kotor", value: order?.gross_amount ? `Rp. ${order.gross_amount.toLocaleString("id-ID")}` : "-", icon: <PiMoney />},
    ]

    return (
        <Drawer swipeDirection={isMobile ? "down" : "right"} open={!!view} onOpenChange={(open) => !open && setParams({view: ""})}>
            <DrawerContent aria-describedby="my-order-detail" className={cn(isMobile ? "h-[80vh]" : "")}>
                <DrawerHeader className="flex flex-col items-center justify-center">
                    <DrawerTitle className="flex items-center gap-2">
                        <PiReceipt />
                        Detail Pesanan
                    </DrawerTitle>
                    <DrawerDescription>Lihat informasi pesanan dan detail pembayaranmu.</DrawerDescription>
                </DrawerHeader>

                <div className="px-6 overflow-y-auto flex-1">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    ) : !orderData?.success && !!view ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <PiX />
                                </EmptyMedia>
                                <EmptyTitle>Gagal ambil pesanan</EmptyTitle>
                                <EmptyDescription>Gagal ambil pesanan. Coba lagi, ya.</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <AnimDiv className="w-full">
                            <div className="flex flex-col items-center justify-center mb-4">
                                {order?.entitlements && order.entitlements.length > 0 && (
                                    <div className="text-center">
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Item yang Dibeli</div>
                                        <ul className="space-y-1">
                                            {order.entitlements.map((e) => (
                                                <li key={e.id} className="text-sm">
                                                    {e.product.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <Button className="rounded-lg mt-3 space-x-2" disabled={isChecking} onClick={handleCheckOrderStatus} size={"sm"} variant="outline">
                                    {isChecking ? (
                                        <>
                                            <Loader2 className="animate-spin" />
                                            Memeriksa...
                                        </>
                                    ) : (
                                        <>
                                            <PiArrowsClockwise /> Periksa Status
                                        </>
                                    )}
                                </Button>
                            </div>

                            <ul className="space-y-4">
                                {displayData.map((d, index) => (
                                    <li
                                        onClick={() => {
                                            if (!d.handleFn) return
                                            d.handleFn()
                                        }}
                                        className={cn("text-sm flex items-center gap-4", d.handleFn ? "cursor-pointer" : "")}
                                        key={index}>
                                        <div className="text-lg bg-muted min-w-7 min-h-7 rounded-sm flex items-center justify-center">{d.icon}</div>
                                        <div>
                                            <div>{d.label}</div>
                                            <div className="text-muted-foreground">{d.value}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </AnimDiv>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default MyOrderDetailDrawer

