import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"
import {NextResponse} from "next/server"

export function apiSuccess<T>(data: T, message: string, status = 200): NextResponse<ServerResult<T>> {
    return NextResponse.json({success: true, data, message}, {status})
}

export function apiError(error: unknown): NextResponse<ServerResult<null>> {
    const {status, ...body} = handleServerError(error)
    return NextResponse.json(body, {status})
}
