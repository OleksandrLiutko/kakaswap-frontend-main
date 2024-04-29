import { flackDividendsABI } from 'config/abi/IFlackDividends'
import { xFlackTokenABI } from 'config/abi/IXFlackToken'
import { DIVIDENDS_ADDRESS, XFLACK_ADDRESS } from 'config/constants/flack'
import { useEffect, useState } from 'react'
import { getContractResult, getFormattedUnits } from 'utils/flackHelper'
import { useAccount, useChainId, useContractReads } from 'wagmi'

export const useUserAllocationData = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const [allocated, setAllocated] = useState(0)
  const [manualAllocation, setManualAllocation] = useState(0)
  const [redeemAllocation, setRedeemAllocation] = useState(0)
  const [xFlackBalance, setXFlackBalance] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: DIVIDENDS_ADDRESS,
        abi: flackDividendsABI,
        chainId,
        functionName: 'usersAllocation',
        args: [address as `0x${string}`],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'xFlackBalances',
        args: [address as `0x${string}`],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'redeemDividendsAdjustment',
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
    if (
      contractResult[2].status === 'success' &&
      contractResult[1].status === 'success' &&
      contractResult[0].status === 'success'
    ) {
      const _totalAllocation = getFormattedUnits(contractResult[0].result)
      const _redeemingAmount = getFormattedUnits(contractResult[1].result[1])
      const _redeemDividendsAdjustment = getFormattedUnits(contractResult[2].result, 0)
      const _redeemingAllocation = (_redeemingAmount * _redeemDividendsAdjustment) / 100
      setManualAllocation(_totalAllocation - _redeemingAllocation)
      setRedeemAllocation(_redeemingAllocation)
      setAllocated(_totalAllocation)
    }
    setXFlackBalance(getContractResult(contractResult[3]))
  }, [contractResult])

  return {
    allocated,
    manualAllocation,
    redeemAllocation,
    xFlackBalance,
    refetchContracts,
  }
}
