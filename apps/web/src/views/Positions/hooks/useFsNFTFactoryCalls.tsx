import { useCallback } from 'react'
import { useFsNftPoolFactoryContract } from 'hooks/useContract1'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'

const options = {}

const create = async (poolFactoryContract, pairAddress) => {
  return poolFactoryContract.write.createPool([pairAddress], { ...options })
}

const useFsNFTFactoryCalls = (poolFactoryAddress: string) => {
  const { address } = useAccount()
  const poolFactoryContract = useFsNftPoolFactoryContract(poolFactoryAddress)

  const handleCreatePool = useCallback(
    async (pairAddress) => {
      return create(poolFactoryContract, pairAddress)
    },
    [poolFactoryContract],
  )

  return {
    onCreatePool: handleCreatePool,
  }
}

export default useFsNFTFactoryCalls
