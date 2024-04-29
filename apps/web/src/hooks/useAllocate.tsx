import { useCallback } from 'react'
import { useXFlackContract } from 'hooks/useContract1'
import { useAccount } from 'wagmi'
import { getParseUnits } from 'utils/flackHelper'

const options = {}

const allocate = async (xFlackContract, usageAddress, amountToAllocate, data) => {
  return xFlackContract.write.allocate([usageAddress, amountToAllocate, data], { ...options })
}

const deallocate = async (xFlackContract, usageAddress, amountToDeAllocate, data) => {
  return xFlackContract.write.deallocate([usageAddress, amountToDeAllocate, data], { ...options })
}

const useAllocate = () => {
  const { address } = useAccount()
  const xFlackContract = useXFlackContract()

  const handleAllocate = useCallback(
    async (usageAddress, amountToAllocate, data = '') => {
      return allocate(xFlackContract, usageAddress, getParseUnits(amountToAllocate), data)
    },
    [xFlackContract],
  )

  const handleDeAllocate = useCallback(
    async (usageAddress, amountToDeAllocate, data = '') => {
      return deallocate(xFlackContract, usageAddress, getParseUnits(amountToDeAllocate), data)
    },
    [xFlackContract],
  )

  return { onAllocate: handleAllocate, onDeallocate: handleDeAllocate }
}

export default useAllocate
