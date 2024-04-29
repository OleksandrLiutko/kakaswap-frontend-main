import { ChainId } from '@pancakeswap/chains'
import {
  BIT_QUERY,
  INFO_CLIENT,
  STABLESWAP_SUBGRAPH_CLIENT,
  INFO_CLIENT_ETH,
  V3_SUBGRAPH_URLS,
  V3_BSC_INFO_CLIENT,
} from 'config/constants/endpoints'
import { GraphQLClient } from 'graphql-request'
import { INFO_CLIENT_WITH_CHAIN } from '../config/constants/endpoints'

// Extra headers
// Mostly for dev environment
// No production env check since production preview might also need them
export const getGQLHeaders = (endpoint: string) => {
  if (endpoint === INFO_CLIENT && process.env.NEXT_PUBLIC_NODE_REAL_HEADER) {
    return {
      origin: process.env.NEXT_PUBLIC_NODE_REAL_HEADER,
    }
  }
  return undefined
}

export const infoClient = new GraphQLClient(INFO_CLIENT)

export const infoClientWithChain = (chainId: number) => {
  if (INFO_CLIENT_WITH_CHAIN[chainId]) {
    return new GraphQLClient(INFO_CLIENT_WITH_CHAIN[chainId], {
      headers: getGQLHeaders(INFO_CLIENT_WITH_CHAIN[chainId]),
    })
  }
  return undefined
}

export const v3Clients = {
  [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ETHEREUM]),
  [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.GOERLI]),
  [ChainId.BSC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC]),
  [ChainId.BSC_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BSC_TESTNET]),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ARBITRUM_ONE]),
  [ChainId.ARBITRUM_GOERLI]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ARBITRUM_GOERLI]),
  [ChainId.POLYGON_ZKEVM]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.POLYGON_ZKEVM]),
  [ChainId.ZKSYNC]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ZKSYNC]),
  [ChainId.ZKSYNC_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.ZKSYNC_TESTNET]),
  [ChainId.LINEA]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.LINEA]),
  [ChainId.LINEA_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.LINEA_TESTNET]),
  [ChainId.BASE]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BASE]),
  [ChainId.BASE_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.BASE_TESTNET]),
  [ChainId.OPBNB]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.OPBNB]),

  [ChainId.KAKAROT_TESTNET]: new GraphQLClient(V3_SUBGRAPH_URLS[ChainId.KAKAROT_TESTNET]),
}

export const v3InfoClients = { ...v3Clients, [ChainId.BSC]: new GraphQLClient(V3_BSC_INFO_CLIENT) }

export const infoClientETH = new GraphQLClient(INFO_CLIENT_ETH)

export const v2Clients = {
  [ChainId.ETHEREUM]: infoClientETH,
  [ChainId.BSC]: infoClient,
  [ChainId.POLYGON_ZKEVM]: new GraphQLClient(INFO_CLIENT_WITH_CHAIN[ChainId.POLYGON_ZKEVM]),
  [ChainId.ZKSYNC]: new GraphQLClient(INFO_CLIENT_WITH_CHAIN[ChainId.ZKSYNC]),
  [ChainId.LINEA]: new GraphQLClient(INFO_CLIENT_WITH_CHAIN[ChainId.LINEA]),
  [ChainId.BASE]: new GraphQLClient(INFO_CLIENT_WITH_CHAIN[ChainId.BASE]),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(INFO_CLIENT_WITH_CHAIN[ChainId.ARBITRUM_ONE]),
  [ChainId.OPBNB]: new GraphQLClient(INFO_CLIENT_WITH_CHAIN[ChainId.OPBNB]),

  [ChainId.KAKAROT_TESTNET]: new GraphQLClient(INFO_CLIENT_WITH_CHAIN[ChainId.KAKAROT_TESTNET]),
}

export const infoStableSwapClient = new GraphQLClient(STABLESWAP_SUBGRAPH_CLIENT)

export const infoServerClient = new GraphQLClient(INFO_CLIENT, {
  timeout: 5000,
  headers: {
    origin: 'https://flack.exchange',
  },
})

export const stableSwapClient = new GraphQLClient(STABLESWAP_SUBGRAPH_CLIENT)

export const bitQueryServerClient = new GraphQLClient(BIT_QUERY, {
  headers: {
    // only server, no `NEXT_PUBLIC` not going to expose in client
    'X-API-KEY': process.env.BIT_QUERY_HEADER || '',
  },
  timeout: 5000,
})
