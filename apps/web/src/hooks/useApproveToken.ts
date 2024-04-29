import { useCallback } from 'react'
import { useFlackContract } from 'hooks/useContract1'
import { useERC20 } from './useContract'

const options = {}

const approveToken = async (flackContract, amountToApprove, spender) => {
  return flackContract.write.approve([spender, amountToApprove], { ...options })
}

const useApproveToken = (tokenAddress) => {
  const flackContract = useERC20(tokenAddress)

  const handleApprove = useCallback(
    async (amountToApprove, spender) => {
      return approveToken(flackContract, amountToApprove, spender)
    },
    [flackContract],
  )

  return { onApprove: handleApprove }
}

export default useApproveToken
