import { useEffect, useState } from 'react'
import { useAccount, useChainId, useContractReads } from 'wagmi'
import { getContractResult, getFormattedUnits } from 'utils/flackHelper'
import {
  DIVIDENDS_ADDRESS,
  FLACK_ADDRESS,
  LAUNCHPAD_ADDRESS,
  XFLACK_ADDRESS,
  YIELD_BOOSTER_ADDRESS,
} from 'config/constants/flack'
import { flackTokenABI } from 'config/abi/IFlackToken'
import { xFlackTokenABI } from 'config/abi/IXFlackToken'
import { flackDividendsABI } from 'config/abi/IFlackDividends'
import { flackYieldBoosterABI } from 'config/abi/IFlackYieldBooster'
import { flackLaunchpadABI } from 'config/abi/IFlackLaunchpad'

export const useDashboardData = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const [flackWalletBalance, setFlackWalletBalance] = useState(0)
  const [xFlackWalletBalance, setXFlackWalletBalance] = useState(0)
  const [allocation, setAllocation] = useState(0)
  const [redeemingBalance, setRedeemingBalance] = useState(0)

  const [dividensAllocation, setDividensAllocation] = useState(0)
  const [boosterAllocation, setBoosterAllocation] = useState(0)
  const [launchpadAllocation, setLaunchpadAllocation] = useState(0)

  const [dividensProtocolAllocation, setDividensProtocolAllocation] = useState(0)
  const [boosterProtocolAllocation, setBoosterProtocolAllocation] = useState(0)
  const [launchpadProtocolAllocation, setLaunchpadProtocolAllocation] = useState(0)

  const [dividensDeAllocationFee, setDividensDeAllocationFee] = useState(0)
  const [boosterDeAllocationFee, setBoosterDeAllocationFee] = useState(0)
  const [launchpadDeAllocationFee, setLaunchpadDeAllocationFee] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: FLACK_ADDRESS,
        abi: flackTokenABI,
        chainId,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'getXFlackBalance',
        args: [address as `0x${string}`],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'getUsageAllocation',
        args: [address as `0x${string}`, DIVIDENDS_ADDRESS],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'getUsageAllocation',
        args: [address as `0x${string}`, YIELD_BOOSTER_ADDRESS],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'getUsageAllocation',
        args: [address as `0x${string}`, LAUNCHPAD_ADDRESS],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [DIVIDENDS_ADDRESS],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [YIELD_BOOSTER_ADDRESS],
      },
      {
        address: XFLACK_ADDRESS,
        abi: xFlackTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [LAUNCHPAD_ADDRESS],
      },
      {
        address: DIVIDENDS_ADDRESS,
        abi: flackDividendsABI,
        chainId,
        functionName: 'totalAllocation',
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: flackYieldBoosterABI,
        chainId,
        functionName: 'totalAllocation',
      },
      {
        address: LAUNCHPAD_ADDRESS,
        abi: flackLaunchpadABI,
        chainId,
        functionName: 'totalAllocation',
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    setFlackWalletBalance(getContractResult(contractResult[0]))
    setXFlackWalletBalance(getContractResult(contractResult[1]))
    if (contractResult[2].status === 'success') {
      setAllocation(getFormattedUnits(contractResult[2].result[0]))
      setRedeemingBalance(getFormattedUnits(contractResult[2].result[1]))
    }
    setDividensAllocation(getContractResult(contractResult[3]))
    setBoosterAllocation(getContractResult(contractResult[4]))
    setLaunchpadAllocation(getContractResult(contractResult[5]))
    setDividensDeAllocationFee(getContractResult(contractResult[6], 2))
    setBoosterDeAllocationFee(getContractResult(contractResult[7], 2))
    setLaunchpadDeAllocationFee(getContractResult(contractResult[8], 2))
    setDividensProtocolAllocation(getContractResult(contractResult[9]))
    setBoosterProtocolAllocation(getContractResult(contractResult[10]))
    setLaunchpadProtocolAllocation(getContractResult(contractResult[11]))
  }, [contractResult])

  return {
    flackWalletBalance,
    xFlackWalletBalance,
    allocation,
    redeemingBalance,
    dividensAllocation,
    boosterAllocation,
    launchpadAllocation,
    dividensProtocolAllocation,
    boosterProtocolAllocation,
    launchpadProtocolAllocation,
    dividensDeAllocationFee,
    boosterDeAllocationFee,
    launchpadDeAllocationFee,
    refetchContracts,
  }
}
