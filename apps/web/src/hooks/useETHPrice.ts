import { ChainId } from '@pancakeswap/chains'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { ETH_PRICE_FEED } from 'config/constants/kakarot'
import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { publicClient } from 'utils/wagmi'
import { formatUnits } from 'viem'
import { useContractReads } from 'wagmi'

export const getEthPrice = async () => {
  const data = await publicClient({ chainId: ChainId.KAKAROT_TESTNET }).readContract({
    abi: chainlinkOracleABI,
    address: ETH_PRICE_FEED,
    functionName: 'latestAnswer',
  })
  return formatUnits(data, 8)
}

export const useEthPrice = () => {
  const [ethPrice, setEthPrice] = useState<string | undefined>(undefined)

  useEffect(() => {
    const getBNBPriceFromOracle = async () => {
      const _ethPrice = await getEthPrice()
      setEthPrice(_ethPrice)
    }
    getBNBPriceFromOracle()
  }, [])

  return {
    ethPrice,
  }
}
