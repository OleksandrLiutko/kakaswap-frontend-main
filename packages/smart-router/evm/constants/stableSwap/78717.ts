import { ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { blockspotTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from './types'

const mockUSDT = new ERC20Token(
  ChainId.BLOCKSPOT_TESTNET,
  '0x1381851900a4b43397E5DF7f2e90eC5Be04fcB3A',
  18,
  'USDT',
  'MOCK Token',
)

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'USDT-USDC LP',
    lpAddress: '0x0c31acb790a49fb086ad3eb4f264ebaafc09062a',
    token: mockUSDT, // coins[0]
    quoteToken: blockspotTokens.usdc, // coins[1]
    stableSwapAddress: '0xcbbd01247c2b93f3f66f0723e40d135913a397fa',
    infoStableSwapAddress: '0x9AAa7fE403F55a8c1648c19d071Fde34Cf8a02b0',
    stableLpFee: 0.0004,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
