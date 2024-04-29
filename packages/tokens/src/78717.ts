import { WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, USDT, FLACK, DAI } from './common'

export const blockspotTokens = {
  weth: WETH9[ChainId.BLOCKSPOT_TESTNET],
  usdc: USDC[ChainId.BLOCKSPOT_TESTNET],
  usdt: USDT[ChainId.BLOCKSPOT_TESTNET],
  flack: FLACK[ChainId.BLOCKSPOT_TESTNET],
}
