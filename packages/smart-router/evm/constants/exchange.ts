import { Token, WNATIVE } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import {
  bscTokens,
  bscTestnetTokens,
  BUSD,
  USDC,
  USDT,
  WBTC_ETH,
  arbitrumTokens,
  arbitrumGoerliTokens,
  ethereumTokens,
  polygonZkEvmTokens,
  polygonZkEvmTestnetTokens,
  zksyncTokens,
  zkSyncTestnetTokens,
  lineaTestnetTokens,
  baseTokens,
  baseTestnetTokens,
  opBnbTokens,
  opBnbTestnetTokens,
  blockspotTokens,
  lineaTokens,
} from '@pancakeswap/tokens'

import { ChainMap, ChainTokenList } from '../types'

export const SMART_ROUTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
  [ChainId.GOERLI]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
  [ChainId.BSC]: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
  [ChainId.BSC_TESTNET]: '0x9a489505a00cE272eAa5e07Dba6491314CaE3796',
  [ChainId.ARBITRUM_ONE]: '0x32226588378236Fd0c7c4053999F88aC0e5cAc77',
  [ChainId.ARBITRUM_GOERLI]: '0xBee35e9Cbd9595355Eaf5DE2055EF525adB41bE6',
  [ChainId.POLYGON_ZKEVM]: '0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x365C5F0B816828936320ea143e337fbA7D1b911E',
  [ChainId.ZKSYNC]: '0xf8b59f3c3Ab33200ec80a8A58b2aA5F5D2a8944C',
  [ChainId.ZKSYNC_TESTNET]: '0x4DC9186c6C5F7dd430c7b6D8D513076637902241',
  [ChainId.LINEA]: '0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86',
  [ChainId.LINEA_TESTNET]: '0x21d809FB4052bb1807cfe2418bA638d72F4aEf87',
  [ChainId.OPBNB]: '0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86',
  [ChainId.OPBNB_TESTNET]: '0xf317eD77Baed624d0EA2384AA88D91B774a9b009',
  [ChainId.BASE]: '0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86',
  [ChainId.BASE_TESTNET]: '0xDDC44b8507B4Ca992fB60F0ECdF5651A87668509',

  [ChainId.BLOCKSPOT_TESTNET]: '0x8E91C02491BfcF4701B9C738268D99a587b4dB9E',
} as const satisfies Record<ChainId, string>

export const V2_ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0xEfF92A263d31888d860bD50809A8D171709b7b1c',
  [ChainId.GOERLI]: '0xEfF92A263d31888d860bD50809A8D171709b7b1c',
  [ChainId.BSC]: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  [ChainId.BSC_TESTNET]: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  [ChainId.ARBITRUM_ONE]: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb',
  [ChainId.ARBITRUM_GOERLI]: '0xB8054A1F11090fbe82B45aC3c72e86732f8355DC',
  [ChainId.POLYGON_ZKEVM]: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x1ac9F6489487a282961b3929bCFA0a773251315E',
  [ChainId.ZKSYNC]: '0x5aEaF2883FBf30f3D62471154eDa3C0c1b05942d',
  [ChainId.ZKSYNC_TESTNET]: '0xA0Fbd5d1474950bc9417FB00f9d4e2ee0385c560',
  [ChainId.LINEA]: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb',
  [ChainId.LINEA_TESTNET]: '0xD7A304138D50C125733d1fE8a2041199E4944Aa1',
  [ChainId.OPBNB]: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb',
  [ChainId.OPBNB_TESTNET]: '0x62FF25CFD64E55673168c3656f4902bD7Aa5F0f4',
  [ChainId.BASE]: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb',
  [ChainId.BASE_TESTNET]: '0xC259d1D3476558630d83b0b60c105ae958382792',

  [ChainId.BLOCKSPOT_TESTNET]: '0x8054f934D7f41143E1C5E868FD663A4D71a51BAF',
}

export const STABLE_SWAP_INFO_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '',
  [ChainId.GOERLI]: '',
  [ChainId.BSC]: '0xa680d27f63Fa5E213C502d1B3Ca1EB6a3C1b31D6',
  [ChainId.BSC_TESTNET]: '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546',
  [ChainId.ARBITRUM_ONE]: '',
  [ChainId.ARBITRUM_GOERLI]: '',
  [ChainId.POLYGON_ZKEVM]: '',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '',
  [ChainId.ZKSYNC]: '',
  [ChainId.ZKSYNC_TESTNET]: '',
  [ChainId.LINEA]: '',
  [ChainId.LINEA_TESTNET]: '',
  [ChainId.OPBNB]: '',
  [ChainId.OPBNB_TESTNET]: '',
  [ChainId.BASE]: '',
  [ChainId.BASE_TESTNET]: '',

  [ChainId.BLOCKSPOT_TESTNET]: '0x9AAa7fE403F55a8c1648c19d071Fde34Cf8a02b0',
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.GOERLI]: [WNATIVE[ChainId.GOERLI], USDC[ChainId.GOERLI], BUSD[ChainId.GOERLI]],
  [ChainId.BSC]: [
    bscTokens.wbnb,
    bscTokens.cake,
    bscTokens.busd,
    bscTokens.usdt,
    bscTokens.btcb,
    bscTokens.eth,
    bscTokens.usdc,
  ],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.wbnb, bscTestnetTokens.cake, bscTestnetTokens.busd],
  [ChainId.ARBITRUM_ONE]: [arbitrumTokens.weth, arbitrumTokens.usdt, arbitrumTokens.usdc],
  [ChainId.ARBITRUM_GOERLI]: [arbitrumGoerliTokens.weth, arbitrumGoerliTokens.usdc],
  [ChainId.POLYGON_ZKEVM]: [polygonZkEvmTokens.weth, polygonZkEvmTokens.usdt],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [polygonZkEvmTestnetTokens.weth, polygonZkEvmTestnetTokens.usdt],
  [ChainId.ZKSYNC]: [zksyncTokens.usdc, zksyncTokens.weth],
  [ChainId.ZKSYNC_TESTNET]: [zkSyncTestnetTokens.usdc, zkSyncTestnetTokens.weth],
  [ChainId.LINEA]: [lineaTokens.usdc, lineaTokens.weth],
  [ChainId.LINEA_TESTNET]: [lineaTestnetTokens.usdc, lineaTestnetTokens.weth],
  [ChainId.OPBNB]: [opBnbTokens.wbnb, opBnbTokens.usdt],
  [ChainId.OPBNB_TESTNET]: [opBnbTestnetTokens.usdc, opBnbTestnetTokens.wbnb],
  [ChainId.BASE]: [baseTokens.usdc, baseTokens.weth],
  [ChainId.BASE_TESTNET]: [baseTestnetTokens.usdc, baseTestnetTokens.weth],

  [ChainId.BLOCKSPOT_TESTNET]: [blockspotTokens.usdt, blockspotTokens.usdc, blockspotTokens.weth],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.BSC]: {
    // SNFTS-SFUND
    [bscTokens.snfts.address]: [bscTokens.sfund],

    [bscTokens.ankr.address]: [bscTokens.ankrbnb],
    [bscTokens.ankrbnb.address]: [bscTokens.ankrETH, bscTokens.ankr],
    [bscTokens.ankrETH.address]: [bscTokens.ankrbnb],

    // REVV - EDU
    [bscTokens.revv.address]: [bscTokens.edu],
    [bscTokens.edu.address]: [bscTokens.revv],
    // unshETH - USH
    [bscTokens.unshETH.address]: [bscTokens.ush],
    [bscTokens.ush.address]: [bscTokens.unshETH],

    [bscTokens.tusd.address]: [bscTokens.usdd],
    [bscTokens.usdd.address]: [bscTokens.tusd],
  },
  [ChainId.ETHEREUM]: {
    // alETH - ALCX
    [ethereumTokens.alcx.address]: [ethereumTokens.alETH],
    [ethereumTokens.alETH.address]: [ethereumTokens.alcx],

    // rETH - ETH
    [ethereumTokens.weth.address]: [ethereumTokens.rETH],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.BSC]: {
    [bscTokens.axlusdc.address]: [bscTokens.usdt],
  },
}
