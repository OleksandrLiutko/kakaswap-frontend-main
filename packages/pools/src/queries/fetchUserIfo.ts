import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { ChainId } from '@pancakeswap/chains'
import { Address, getContract, WalletClient, GetContractReturnType, PublicClient } from 'viem'

import { iCakeABI } from '../abis/ICake'
import { ICAKE } from '../constants/contracts'
import { OnChainProvider } from '../types'
import { getContractAddress } from '../utils'

export const getIfoCreditAddressContract = (
  chainId: ChainId,
  provider: OnChainProvider,
  walletClient?: WalletClient,
): GetContractReturnType<typeof iCakeABI, PublicClient, WalletClient> => {
  const address = getContractAddress(ICAKE, chainId)
  if (!address || address === '0x') {
    throw new Error(`ICAKE not supported on chain ${chainId}`)
  }

  return getContract({ abi: iCakeABI, address, publicClient: provider({ chainId }), walletClient })
}

export const fetchPublicIfoData = async (chainId: ChainId, provider: OnChainProvider) => {
  try {
    const ifoCreditAddressContract = getIfoCreditAddressContract(chainId, provider)
    const ceiling = await ifoCreditAddressContract.read.ceiling()
    return {
      ceiling: new BigNumber(ceiling.toString()).toJSON(),
    }
  } catch (error) {
    return {
      ceiling: BIG_ZERO.toJSON(),
    }
  }
}

interface Params {
  account: Address
  chainId: ChainId
  provider: OnChainProvider
}

export const fetchUserIfoCredit = async ({ account, chainId, provider }: Params) => {
  try {
    const ifoCreditAddressContract = getIfoCreditAddressContract(chainId, provider)
    const credit = await ifoCreditAddressContract.read.getUserCredit([account])
    return new BigNumber(credit.toString()).toJSON()
  } catch (error) {
    console.error(error)
    return BIG_ZERO.toJSON()
  }
}
