import {format as dateFnsFormat} from "date-fns"
import {id} from "date-fns/locale"

export function format(date: Date | string | number, pattern: string): string {
    return dateFnsFormat(new Date(date), pattern, {locale: id})
}