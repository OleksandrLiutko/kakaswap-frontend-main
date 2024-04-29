import { xFlackTokenABI } from 'config/abi/IXFlackToken'
import { XFLACK_ADDRESS } from 'config/constants/kakarot'
import { useXFlackContract } from 'hooks/useContract1'
import { useCallback, useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { useAccount, useContractReads } from 'wagmi'

const options = {}

const approveUsage = async (xFlackContract, address, amountToAllocate) => {
  return xFlackContract.write.approveUsage([address, amountToAllocate], { ...options })
}

export const useAllowanceUsage = (usageAddress) => {
  const { address } = useAccount()
  const [allowance, setAllowance] = useState<number>(0)
  const [allowanceUsage, setAllowanceUsage] = useState<number>(0)
  const xFlackContract = useXFlackContract()

  const handleApproveUsage = useCallback(
    async (amountToApprove) => {
      return approveUsage(xFlackContract, usageAddress, amountToApprove)
    },
    [xFlackContract, usageAddress],
  )

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        functionName: 'allowance',
        args: [address as `0x${string}`, XFLACK_ADDRESS],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        functionName: 'usageApprovals',
        args: [address as `0x${string}`, usageAddress],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    setAllowance(getContractResult(contractResult[0]))
    setAllowanceUsage(getContractResult(contractResult[1]))
  }, [contractResult])

  return { allowanceUsage, allowance, refetchAllowance: refetchContracts, handleApproveUsage }
}
