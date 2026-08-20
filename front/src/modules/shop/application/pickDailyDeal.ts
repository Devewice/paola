import type { Product } from '@modules/shop/domain/entities/Product.ts'

/** Pieza del día: con stock (o sin dato) y foto, rotando por día UTC. */
export function pickDailyDeal(
  products: readonly Product[],
  nowMs: number = Date.now(),
): Product | null {
  const pool = products.filter((item) => {
    if (item.stock !== null && item.stock <= 0) return false
    return Boolean(item.photoSrc)
  })
  if (!pool.length) return null
  const day = Math.floor(nowMs / 86_400_000)
  return pool[day % pool.length] ?? null
}
