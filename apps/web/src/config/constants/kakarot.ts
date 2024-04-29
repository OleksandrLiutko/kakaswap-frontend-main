import { GraphQLClient } from 'graphql-request'

export const FLACK_ADDRESS: `0x${string}` = '0xAc0Ff6fa6e90c43C2249dC590741Ab5eF90d2e3b'
export const XFLACK_ADDRESS: `0x${string}` = '0x93f35d7BEe4d5Dd4d87d7C7BE2683B22B6ef3f0B'
export const FLACK_MASTER: `0x${string}` = '0xA1064c72FbDa47bdd50bCB686c7e7CA3AF11A5b8'
export const NFT_POOL_FACTORY_ADDRESS: `0x${string}` = '0x178Db3a19807d513b06A97be13f15ceE803DFD1f'
export const YIELD_BOOSTER_ADDRESS: `0x${string}` = '0x83d682582E3337751C5AB540CBeDa767732a31Ff'
export const DIVIDENDS_ADDRESS: `0x${string}` = '0x537Cc85f2DF98165649eB1590028B1F0FDE707E3'
export const LAUNCHPAD_ADDRESS: `0x${string}` = '0x5043a8B4a8e287c235B5FdE51e5180B30BA56424'
export const POSITION_HELPER_ADDRESS: `0x${string}` = '0x8238901fffF26aE7B4d56975337B23a4113B6d44'
export const HYPER_POOL_FACTORY_ADDRESS: `0x${string}` = '0x91e85cB2Bb30eC83551108311C2f89fB9190274D'

export const ETH_PRICE_FEED: `0x${string}` = '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e'
// export const ETH_PRICE_FEED: `0x${string}` = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'

export const POSITIONS_SUBGRAPH = 'https://info.flack.exchange/subgraphs/name/flack/exchange-positions'

export const positionsSubgraphClient = new GraphQLClient(POSITIONS_SUBGRAPH)
