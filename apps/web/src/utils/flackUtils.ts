import { flackTokenABI } from 'config/abi/IFlackToken'
import { xFlackTokenABI } from 'config/abi/IXFlackToken'
import { flackMasterABI } from 'config/abi/IFlackMaster'
import { flackNftFactoryABI } from 'config/abi/IFlackNftFactory'
import { flackYieldBoosterABI } from 'config/abi/IFlackYieldBooster'
import { flackLaunchpadABI } from 'config/abi/IFlackLaunchpad'
import { flackDividendsABI } from 'config/abi/IFlackDividends'
import { positionHelperABI } from 'config/abi/IPositionHelper'

import {
  FLACK_ADDRESS,
  XFLACK_ADDRESS,
  FLACK_MASTER,
  NFT_POOL_FACTORY_ADDRESS,
  YIELD_BOOSTER_ADDRESS,
  DIVIDENDS_ADDRESS,
  LAUNCHPAD_ADDRESS,
  POSITION_HELPER_ADDRESS,
} from 'config/constants/kakarot'

import { useContract } from 'hooks/useContract'
import { publicClient } from './wagmi'

export function usePositionHelperContract() {
  return useContract(POSITION_HELPER_ADDRESS, positionHelperABI)
}

export function useNftFactoryContract() {
  return useContract(NFT_POOL_FACTORY_ADDRESS, flackNftFactoryABI)
}

export async function getNftPoolAddress(chainId: number, lpAddress: `0x${string}`) {
  return publicClient({ chainId })
    .readContract({
      abi: flackNftFactoryABI,
      address: NFT_POOL_FACTORY_ADDRESS,
      functionName: 'getPool',
      args: [lpAddress],
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      return undefined
    })
}
