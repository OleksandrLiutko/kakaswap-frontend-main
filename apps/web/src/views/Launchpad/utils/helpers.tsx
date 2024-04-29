import { ChainId, WETH9 } from '@pancakeswap/sdk'

export const getSymbol = (symbol: string | undefined): string => {
  if (!symbol) return ''
  if (symbol === 'WETH') return 'ETH'
  return symbol
}

export const isEthSale = (saleToken: string): boolean => {
  if (saleToken.toLocaleLowerCase() === WETH9[ChainId.BLOCKSPOT_TESTNET].address.toLocaleLowerCase()) return true
  return false
}
