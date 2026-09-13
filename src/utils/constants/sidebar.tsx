import {PiCardholder, PiClock, PiCreditCard, PiFileText, PiFlag, PiGear, PiHouse, PiKey, PiNotebook, PiPackage, PiReceipt, PiStorefront, PiTag, PiTicket, PiTrophy, PiUser} from "react-icons/pi"

export interface MenuItem {
    label: string
    href: string
    icon: React.ReactNode
    permissions: string[]
    roles: string[]
    children: MenuItem[]
}

export function hasAccess(item: MenuItem, userPermissions: string[], userRoles: string[]): boolean {
    const matchesDirect = item.permissions.length === 0 || item.permissions.some((p) => userPermissions.includes(p))

    if (item.children.length > 0) {
        return item.children.some((child) => hasAccess(child, userPermissions, userRoles))
    }

    return matchesDirect
}

export const menuItems = [
    {
        label: "Beranda",
        href: "/home",
        icon: <PiHouse />,
        permissions: ["read home", "manage home"],
        roles: [],
        children: [],
    },

    {
        label: "Tryout",
        href: "/tryouts",
        icon: <PiStorefront />,
        permissions: ["read exams", "manage exams"],
        roles: [],
        children: [],
    },

    {
        label: "Tryout Saya",
        href: "/my-tryouts",
        icon: <PiNotebook />,
        permissions: ["read exams", "manage exams"],
        roles: [],
        children: [],
    },

    {
        label: "Papan Peringkat",
        href: "/leaderboards",
        icon: <PiTrophy />,
        permissions: ["read exams", "manage exams"],
        roles: [],
        children: [],
    },

    {
        label: "Pesanan Saya",
        href: "/my-orders",
        icon: <PiReceipt />,
        permissions: [],
        roles: [],
        children: [],
    },

    {
        label: "Sesi Saya",
        href: "/my-sessions",
        icon: <PiClock />,
        permissions: ["read exams", "manage exams"],
        roles: [],
        children: [],
    },

    {
        label: "Pengaturan",
        href: "",
        icon: <PiGear />,
        permissions: [],
        roles: [],
        children: [
            {
                label: "Ujian",
                href: "/exams",
                icon: <PiFileText />,
                permissions: ["read exams", "manage exams"],
                roles: [],
                children: [],
            },
            {
                label: "Tag",
                href: "/tags",
                icon: <PiTag />,
                permissions: ["read tags", "manage tags"],
                roles: [],
                children: [],
            },
        ],
    },
    {
        label: "Admin",
        href: "",
        icon: <PiCreditCard />,
        permissions: [],
        roles: [],
        children: [
            {
                label: "Izin Akses",
                href: "/permissions",
                icon: <PiKey />,
                permissions: ["read permissions", "manage permissions"],
                roles: [],
                children: [],
            },
            {
                label: "Peran",
                href: "/roles",
                icon: <PiCardholder />,
                permissions: ["read roles", "manage roles"],
                roles: [],
                children: [],
            },
            {
                label: "Pengguna",
                href: "/users",
                icon: <PiUser />,
                permissions: ["read users", "manage users"],
                roles: [],
                children: [],
            },
            {
                label: "Pesanan",
                href: "/orders",
                icon: <PiTicket />,
                permissions: ["read orders", "manage orders"],
                roles: [],
                children: [],
            },
            {
                label: "Produk",
                href: "/products",
                icon: <PiPackage />,
                permissions: ["read products", "manage products"],
                roles: [],
                children: [],
            },

            {
                label: "Laporan",
                href: "/reports",
                icon: <PiFlag />,
                permissions: ["read reports", "manage reports"],
                roles: [],
                children: [],
            },
        ],
    },
]
