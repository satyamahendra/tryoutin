declare module "midtrans-client" {
    interface SnapConfig {
        isProduction: boolean
        clientKey: string
        serverKey?: string
    }

    interface CoreApiConfig {
        isProduction: boolean
        serverKey: string
        clientKey?: string
    }

    interface TransactionDetails {
        order_id: string
        gross_amount: number
    }

    interface Address {
        first_name?: string
        last_name?: string
        email?: string
        phone?: string
        address?: string
        city?: string
        postal_code?: string
        country_code?: string
    }

    interface ItemDetail {
        id: string
        price: number
        quantity: number
        name: string
    }

    interface CustomerDetails {
        first_name?: string
        last_name?: string
        email: string
        phone?: string
        billing_address?: Address
        shipping_address?: Address
    }

    interface TransactionParameter {
        transaction_details: TransactionDetails
        credit_card?: {
            secure: boolean
        }
        item_details?: ItemDetail[]
        customer_details?: CustomerDetails
        [key: string]: unknown
    }

    interface TransactionResponse {
        token: string
        redirect_url: string
    }

    interface SnapTransaction {
        notification(payload: unknown): Promise<Record<string, unknown>>
        status(transactionId: string): Promise<Record<string, unknown>>
        statusB2b(transactionId: string): Promise<Record<string, unknown>>
        approve(transactionId: string): Promise<Record<string, unknown>>
        deny(transactionId: string): Promise<Record<string, unknown>>
        cancel(transactionId: string): Promise<Record<string, unknown>>
        expire(transactionId: string): Promise<Record<string, unknown>>
        refund(transactionId: string, parameter?: Record<string, unknown>): Promise<Record<string, unknown>>
    }

    class Snap {
        constructor(config: SnapConfig)
        transaction: SnapTransaction
        createTransaction(parameter: TransactionParameter): Promise<TransactionResponse>
        createTransactionToken(parameter: TransactionParameter): Promise<string>
        createTransactionRedirectUrl(parameter: TransactionParameter): Promise<string>
    }

    class CoreApi {
        constructor(config: CoreApiConfig)
        charge(parameter: TransactionParameter): Promise<Record<string, unknown>>
        capture(parameter: Record<string, unknown>): Promise<Record<string, unknown>>
        approveTransaction(transactionId: string): Promise<Record<string, unknown>>
        denyTransaction(transactionId: string): Promise<Record<string, unknown>>
        cancelTransaction(transactionId: string): Promise<Record<string, unknown>>
        refundTransaction(transactionId: string, parameter?: Record<string, unknown>): Promise<Record<string, unknown>>
        getTransactionStatus(transactionId: string): Promise<Record<string, unknown>>
    }

    class MidtransError extends Error {
        httpStatusCode: number
        ApiResponse: Record<string, unknown>
        rawHttpClientData: unknown
    }

    export {Snap, CoreApi, MidtransError}
}
