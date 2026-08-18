import { SHOP_ASK_PRICE, SHOP_PRICE_LOCALE } from '@modules/shop/constants/copy.ts'

export function formatProductPrice(priceCop: number | null): string {
  if (priceCop === null) return SHOP_ASK_PRICE
  return `$${priceCop.toLocaleString(SHOP_PRICE_LOCALE)}`
}
