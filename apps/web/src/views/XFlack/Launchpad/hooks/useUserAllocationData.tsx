import { flackDividendsABI } from 'config/abi/IFlackDividends'
import { flackLaunchpadABI } from 'config/abi/IFlackLaunchpad'
import { xFlackTokenABI } from 'config/abi/IXFlackToken'
import { DIVIDENDS_ADDRESS, LAUNCHPAD_ADDRESS, XFLACK_ADDRESS } from 'config/constants/flack'
import { useEffect, useState } from 'react'
import { getContractResult, getFormattedUnits } from 'utils/flackHelper'
import { useAccount, useChainId, useContractReads } from 'wagmi'

export const useUserAllocationData = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const [allocated, setAllocated] = useState(0)
  const [allocatedTime, setAllocatedTime] = useState(0)
  const [xFlackBalance, setXFlackBalance] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: LAUNCHPAD_ADDRESS,
        abi: flackLaunchpadABI,
        chainId,
        functionName: 'getUserInfo',
        args: [address as `0x${string}`],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (contractResult[1].status === 'success' && contractResult[0].result) {
      const _allocated = getFormattedUnits(contractResult[0].result[0])
      const _allocatedTime = getFormattedUnits(contractResult[0].result[1], 0)
      setAllocated(_allocated)
      setAllocatedTime(_allocatedTime)
    }
    setXFlackBalance(getContractResult(contractResult[1]))
  }, [contractResult])

  return {
    allocated,
    allocatedTime,
    xFlackBalance,
    refetchContracts,
  }
}
