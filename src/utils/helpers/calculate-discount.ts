export function calculateDiscount(price_actual: number, price_alternate: number): number {
    if (price_actual <= 0) return 0

    return Math.round(((price_actual - price_alternate) / price_actual) * 100)
}
