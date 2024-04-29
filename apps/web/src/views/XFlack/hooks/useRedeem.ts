import { useCallback } from 'react'
import { useXFlackContract } from 'hooks/useContract1'

const options = {}

const redeem = async (xFlackContract, amountToRedeem, duration) => {
  return xFlackContract.write.redeem([amountToRedeem, duration], { ...options })
}

const finalizeRedeem = async (xFlackContract, index) => {
  return xFlackContract.write.finalizeRedeem([index], { ...options })
}

const cancelRedeem = async (xFlackContract, index) => {
  return xFlackContract.write.cancelRedeem([index], { ...options })
}

export const useRedeem = () => {
  const xFlackContract = useXFlackContract()

  const handleRedeem = useCallback(
    async (amountToRedeem, duration) => {
      return redeem(xFlackContract, amountToRedeem, duration)
    },
    [xFlackContract],
  )

  return { onRedeem: handleRedeem }
}

export const useFinalizeRedeem = () => {
  const xFlackContract = useXFlackContract()

  const handleFinalizeRedeem = useCallback(
    async (index) => {
      return finalizeRedeem(xFlackContract, index)
    },
    [xFlackContract],
  )

  return { onFinalizeRedeem: handleFinalizeRedeem }
}

export const useCancelRedeem = () => {
  const xFlackContract = useXFlackContract()

  const handleCancelRedeem = useCallback(
    async (index) => {
      return cancelRedeem(xFlackContract, index)
    },
    [xFlackContract],
  )

  return { onCancelRedeem: handleCancelRedeem }
}
