import {PiCardholder, PiCreditCard, PiHouse, PiKey, PiRobot, PiUser} from "react-icons/pi"

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
        label: "Home",
        href: "/home",
        icon: <PiHouse />,
        permissions: ["read home", "manage home"],
        roles: [],
        children: [],
    },
    {
        label: "Admin",
        href: "",
        icon: <PiCreditCard />,
        permissions: [],
        roles: [],
        children: [
            {
                label: "Permissions",
                href: "/permissions",
                icon: <PiKey />,
                permissions: ["read permissions", "manage permissions"],
                roles: [],
                children: [],
            },
            {
                label: "Roles",
                href: "/roles",
                icon: <PiCardholder />,
                permissions: ["read roles", "manage roles"],
                roles: [],
                children: [],
            },
            {
                label: "Users",
                href: "/users",
                icon: <PiUser />,
                permissions: ["read users", "manage users"],
                roles: [],
                children: [],
            },
        ],
    },
]
