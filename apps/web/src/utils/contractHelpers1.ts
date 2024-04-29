import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address, erc20ABI, erc721ABI } from 'wagmi'
import { ChainId } from '@pancakeswap/chains'
import { getViemClients, viemClients } from 'utils/viem'
import { flackTokenABI } from 'config/abi/IFlackToken'
import {
  DIVIDENDS_ADDRESS,
  FLACK_ADDRESS,
  HYPER_POOL_FACTORY_ADDRESS,
  XFLACK_ADDRESS,
  YIELD_BOOSTER_ADDRESS,
} from 'config/constants/kakarot'
import { xFlackTokenABI } from 'config/abi/IXFlackToken'
import { flackDividendsABI } from 'config/abi/IFlackDividends'
import { nftPoolABI } from 'config/abi/nftPool'
import { flackYieldBoosterABI } from 'config/abi/IFlackYieldBooster'
import { hyperPoolABI } from 'config/abi/hyperPool'
import { hyperPoolFactoryABI } from 'config/abi/hyperPoolFactory'
import { fairAuctionABI } from 'config/abi/fairAuction'
import { nftPoolFactoryABI } from 'config/abi/nftPoolFactory'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BLOCKSPOT_TESTNET,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    publicClient: publicClient ?? viemClients[chainId],
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getFlackContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: flackTokenABI,
    address: FLACK_ADDRESS,
    chainId,
    signer,
  })
}
export const getXFlackContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: xFlackTokenABI,
    address: XFLACK_ADDRESS,
    chainId,
    signer,
  })
}

export const getDividendsContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: flackDividendsABI,
    address: DIVIDENDS_ADDRESS,
    chainId,
    signer,
  })
}

export const getYieldBoosterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: flackYieldBoosterABI,
    address: YIELD_BOOSTER_ADDRESS,
    chainId,
    signer,
  })
}

export const getHyperPoolFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: hyperPoolFactoryABI,
    address: HYPER_POOL_FACTORY_ADDRESS,
    chainId,
    signer,
  })
}

export const getLaunchpadContract = (auctionAddress: string, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: fairAuctionABI,
    address: auctionAddress as `0x${string}`,
    chainId,
    signer,
  })
}

export const getFsNFTPoolContract = (poolAddress: string, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftPoolABI,
    address: poolAddress as `0x${string}`,
    chainId,
    signer,
  })
}

export const getFsNFTPoolFactoryContract = (poolFactoryAddress: string, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftPoolFactoryABI,
    address: poolFactoryAddress as `0x${string}`,
    chainId,
    signer,
  })
}

export const getHyperPoolContract = (poolAddress: string, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: hyperPoolABI,
    address: poolAddress as `0x${string}`,
    chainId,
    signer,
  })
}
