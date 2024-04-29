import { ChainId, chainNames } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import { bsc as bsc_, bscTestnet, Chain } from 'wagmi/chains'

export const CHAIN_QUERY_NAME = chainNames

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

export const kakarotTestnet = {
  id: 78717,
  name: 'Kakarot Testnet',
  network: 'blockspot',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://test-rpc.blockspot.tech/'],
      webSocket: ['wss://test-rpc.blockspot.tech/ws'],
    },
    public: {
      http: ['https://test-rpc.blockspot.tech/'],
      webSocket: ['wss://test-rpc.blockspot.tech/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Kakarot Testnet',
      url: 'https://test.blockspotscan.tech/',
    },
  },
  contracts: {
    multicall3: {
      address: '0x55f63EeF16acbe2CfD2Fc03cA8B02a0Aa6904486',
      blockCreated: 125800,
    },
  },
  testnet: true,
} as const satisfies Chain

export const opbnbTestnet = {
  id: ChainId.OPBNB_TESTNET,
  name: 'opBNB Testnet',
  network: 'opbnb-testnet',
  nativeCurrency: bscTestnet.nativeCurrency,
  rpcUrls: {
    default: {
      http: ['https://opbnb-testnet-rpc.bnbchain.org'],
    },
    public: {
      http: ['https://opbnb-testnet-rpc.bnbchain.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'opBNBScan',
      url: 'https://testnet.opbnbscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 3705108,
    },
  },
  testnet: true,
} as const satisfies Chain

export const opbnb = {
  id: ChainId.OPBNB,
  name: 'opBNB Mainnet',
  network: 'opbnb',
  nativeCurrency: bsc_.nativeCurrency,
  rpcUrls: {
    default: {
      http: ['https://opbnb-mainnet-rpc.bnbchain.org'],
    },
    public: {
      http: ['https://opbnb-mainnet-rpc.bnbchain.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'opBNBScan',
      url: 'https://opbnbscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 512881,
    },
  },
} as const satisfies Chain

export const linea = {
  id: ChainId.LINEA,
  name: 'Linea Mainnet',
  network: 'linea-mainnet',
  nativeCurrency: { name: 'Linea Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    infura: {
      http: ['https://linea-mainnet.infura.io/v3'],
      webSocket: ['wss://linea-mainnet.infura.io/ws/v3'],
    },
    default: {
      http: ['https://rpc.linea.build'],
      webSocket: ['wss://rpc.linea.build'],
    },
    public: {
      http: ['https://rpc.linea.build'],
      webSocket: ['wss://rpc.linea.build'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://lineascan.build',
    },
    etherscan: {
      name: 'Etherscan',
      url: 'https://lineascan.build',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 42,
    },
  },
  testnet: false,
} as const satisfies Chain

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.POLYGON_ZKEVM,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.ZKSYNC,
  ChainId.ZKSYNC_TESTNET,
  ChainId.LINEA_TESTNET,
  ChainId.LINEA,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
  ChainId.OPBNB,
  ChainId.OPBNB_TESTNET,
  ChainId.KAKAROT_TESTNET,
]

export const CHAINS = [kakarotTestnet]
