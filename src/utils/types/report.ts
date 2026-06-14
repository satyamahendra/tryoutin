export const STATUS_VALUES = ["open", "in_review", "waiting_user", "waiting_admin", "resolved", "rejected"] as const
export const TYPE_VALUES = ["bug", "billing", "content", "account", "other"] as const

export type StatusType = (typeof STATUS_VALUES)[number]
export type TypeType = (typeof TYPE_VALUES)[number]
