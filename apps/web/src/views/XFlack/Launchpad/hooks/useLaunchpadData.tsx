import { flackDividendsABI } from 'config/abi/IFlackDividends'
import { xFlackTokenABI } from 'config/abi/IXFlackToken'
import { DIVIDENDS_ADDRESS, LAUNCHPAD_ADDRESS, XFLACK_ADDRESS } from 'config/constants/kakarot'
import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { useAccount, useChainId, useContractReads } from 'wagmi'
import { flackLaunchpadABI } from 'config/abi/IFlackLaunchpad'

export const useLaunchpadData = () => {
  const chainId = useChainId()

  const [totalAllocated, setTotalAllocated] = useState(0)
  const [deAllocationCooldown, setDeAllocationCooldown] = useState(0)
  const [deAllocationFee, setDeAllocationFee] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: LAUNCHPAD_ADDRESS,
        abi: flackLaunchpadABI,
        chainId,
        functionName: 'totalAllocation',
      },
      {
        address: LAUNCHPAD_ADDRESS,
        abi: flackLaunchpadABI,
        chainId,
        functionName: 'deallocationCooldown',
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [LAUNCHPAD_ADDRESS],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return

    const _totalAllocated = getContractResult(contractResult[0])
    const _deAllocationCooldown = getContractResult(contractResult[1], 0)
    const _deAllocationFee = getContractResult(contractResult[2], 2)

    setTotalAllocated(_totalAllocated)
    setDeAllocationCooldown(_deAllocationCooldown)
    setDeAllocationFee(_deAllocationFee)
  }, [contractResult])

  return {
    totalAllocated,
    deAllocationCooldown,
    deAllocationFee,
    refetchContracts,
  }
}
