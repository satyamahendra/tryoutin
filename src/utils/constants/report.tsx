import {STATUS_VALUES, TYPE_VALUES} from "@/utils/types/report"
import {PiBug, PiCheckCircle, PiCircle, PiClockUser, PiMagnifyingGlass, PiNewspaper, PiUser, PiWallet, PiXCircle} from "react-icons/pi"

export const reportStatusOptions: {
    label: string
    value: (typeof STATUS_VALUES)[number]
    className: string
    icon: React.ReactNode
}[] = [
    {label: "Open", value: "open", className: "bg-blue-200 text-blue-700", icon: <PiCircle />},
    {label: "In Review", value: "in_review", className: "bg-blue-200 text-blue-700", icon: <PiMagnifyingGlass />},
    {label: "Waiting User", value: "waiting_user", className: "bg-yellow-200 text-yellow-700", icon: <PiClockUser />},
    {label: "Waiting Admin", value: "waiting_admin", className: "bg-yellow-200 text-yellow-700", icon: <PiClockUser />},
    {label: "Resolved", value: "resolved", className: "bg-green-200 text-green-700", icon: <PiCheckCircle />},
    {label: "Rejected", value: "rejected", className: "bg-red-200 text-red-700", icon: <PiXCircle />},
]

export const reportTypeOptions: {
    label: string
    value: (typeof TYPE_VALUES)[number]
    className: string
    icon: React.ReactNode
}[] = [
    {label: "Account", value: "account", className: "bg-blue-200 text-blue-700", icon: <PiUser />},
    {label: "Billing", value: "billing", className: "bg-green-200 text-green-700", icon: <PiWallet />},
    {label: "Bug", value: "bug", className: "bg-yellow-200 text-yellow-700", icon: <PiBug />},
    {label: "Content", value: "content", className: "bg-red-200 text-red-700", icon: <PiNewspaper />},
    {label: "Other", value: "other", className: "bg-purple-200 text-purple-700", icon: <PiCircle />},
]
