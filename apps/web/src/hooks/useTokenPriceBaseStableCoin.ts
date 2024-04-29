import { Currency, Price, TradeType } from '@pancakeswap/swap-sdk-core'
import { useMemo } from 'react'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { STABLE_COIN } from '@pancakeswap/tokens'
import { ChainId } from '@pancakeswap/chains'
import { FLACK_ADDRESS, XFLACK_ADDRESS } from 'config/constants/kakarot'
import { useBestAMMTrade } from './useBestAMMTrade'
import { useActiveChainId } from './useActiveChainId'
import { useCurrency } from './Tokens'

// Get swap price for single token disregarding slippage and price impact
export function useTokenPriceBaseStableCoin(token1Address: string) {
  const { chainId } = useActiveChainId()
  const token1AddressWrap =
    token1Address && token1Address.toLowerCase() === XFLACK_ADDRESS.toLocaleLowerCase() ? FLACK_ADDRESS : token1Address
  const token0Address = STABLE_COIN[chainId ?? ChainId.KAKAROT_TESTNET].address
  const inputCurrency = useCurrency(token0Address)
  const outputCurrency = useCurrency(token1AddressWrap)

  const amount = useMemo(() => tryParseAmount('1', inputCurrency ?? undefined), [inputCurrency])

  const { trade: bestTradeExactIn } = useBestAMMTrade({
    amount,
    currency: outputCurrency as Currency | undefined,
    baseCurrency: inputCurrency as Currency | undefined,
    tradeType: TradeType.EXACT_INPUT,
    maxSplits: 0,
    v2Swap: true,
    v3Swap: true,
    stableSwap: true,
    type: 'auto',
    autoRevalidate: false,
  })

  if (token1AddressWrap && token0Address && token1AddressWrap.toLowerCase() === token0Address.toLowerCase()) {
    const outputTokenPrice = 1.0
    return outputTokenPrice
  }

  if (!inputCurrency || !outputCurrency || !bestTradeExactIn) {
    return null
  }

  let inputTokenPrice = 0
  try {
    inputTokenPrice = parseFloat(
      new Price({
        baseAmount: bestTradeExactIn.inputAmount,
        quoteAmount: bestTradeExactIn.outputAmount,
      }).toSignificant(6),
    )
  } catch (error) {
    //
  }
  if (!inputTokenPrice) {
    return null
  }
  const outputTokenPrice = 1 / inputTokenPrice
  return outputTokenPrice
}
