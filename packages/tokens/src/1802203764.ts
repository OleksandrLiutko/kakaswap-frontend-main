import { WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, USDT, FLACK, DAI } from './common'

export const kakarotTokens = {
  weth: WETH9[ChainId.KAKAROT_TESTNET],
  usdc: USDC[ChainId.KAKAROT_TESTNET],
  usdt: USDT[ChainId.KAKAROT_TESTNET],
  flack: FLACK[ChainId.KAKAROT_TESTNET],
}
