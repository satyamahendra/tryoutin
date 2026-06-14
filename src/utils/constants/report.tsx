import {STATUS_VALUES, TYPE_VALUES} from "@/utils/types/report"
import {PiBug, PiCheckCircle, PiCircle, PiClockUser, PiMagnifyingGlass, PiNewspaper, PiUser, PiWallet, PiXCircle} from "react-icons/pi"

export const reportStatusOptions: {
    label: string
    value: (typeof STATUS_VALUES)[number]
    className: string
    icon: React.ReactNode
}[] = [
    {label: "Open", value: "open", className: "bg-blue-100 text-blue-800", icon: <PiCircle />},
    {label: "In Review", value: "in_review", className: "bg-blue-100 text-blue-800", icon: <PiMagnifyingGlass />},
    {label: "Waiting User", value: "waiting_user", className: "bg-yellow-100 text-yellow-800", icon: <PiClockUser />},
    {label: "Waiting Admin", value: "waiting_admin", className: "bg-yellow-100 text-yellow-800", icon: <PiClockUser />},
    {label: "Resolved", value: "resolved", className: "bg-green-100 text-green-800", icon: <PiCheckCircle />},
    {label: "Rejected", value: "rejected", className: "bg-red-100 text-red-800", icon: <PiXCircle />},
]

export const reportTypeOptions: {
    label: string
    value: (typeof TYPE_VALUES)[number]
    className: string
    icon: React.ReactNode
}[] = [
    {label: "Account", value: "account", className: "bg-blue-100 text-blue-800", icon: <PiUser />},
    {label: "Billing", value: "billing", className: "bg-green-100 text-green-800", icon: <PiWallet />},
    {label: "Bug", value: "bug", className: "bg-yellow-100 text-yellow-800", icon: <PiBug />},
    {label: "Content", value: "content", className: "bg-red-100 text-red-800", icon: <PiNewspaper />},
    {label: "Other", value: "other", className: "bg-purple-100 text-purple-800", icon: <PiCircle />},
]
