import { xFlackTokenABI } from 'config/abi/IXFlackToken'
import { XFLACK_ADDRESS } from 'config/constants/kakarot'
import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { useAccount, useContractReads } from 'wagmi'

export const useAllowanceUsage = (usageAddress) => {
  const { address } = useAccount()
  const [allowanceUsage, setAllowanceUsage] = useState<number>(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
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
    setAllowanceUsage(getContractResult(contractResult[0]))
  }, [contractResult])
  return { allowanceUsage, refetchAllowance: refetchContracts }
}
