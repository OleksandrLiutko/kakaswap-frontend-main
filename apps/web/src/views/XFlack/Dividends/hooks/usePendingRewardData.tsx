import { flackDividendsABI } from 'config/abi/IFlackDividends'
import { DIVIDENDS_ADDRESS } from 'config/constants/kakarot'
import { useEffect, useMemo, useState } from 'react'
import { getFormattedUnits } from 'utils/flackHelper'
import { useAccount, useContractReads } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { distributedTokenInfo } from '../config'

interface PendingRewardInfo {
  name: string
  pendingReward: number
  pendingRewardInUSD: number
}

export const usePendingRewardData = (xFlackPrice, ethUsdtLpPrice) => {
  const { address } = useAccount()
  const { chainId } = useActiveChainId()

  const [pendingRewardData, setPendingRewardData] = useState<PendingRewardInfo[]>([])
  const [totalPendingRewardInUSD, setTotalPendingRewardInUSD] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: useMemo(
      () =>
        distributedTokenInfo.map((item) => ({
          abi: flackDividendsABI,
          address: DIVIDENDS_ADDRESS,
          functionName: 'pendingDividendsAmount',
          args: [item.token, address as `0x${string}`],
          chainId,
        })),
      [chainId, address],
    ),
    cacheTime: 0,
  })

  useEffect(() => {
    if (!contractResult) return
    const _filterResult = contractResult.filter((item) => item.status === 'success')
    let _totalPending = 0
    const _pendingRewardData = _filterResult.map((item, index) => {
      const _pending = getFormattedUnits(item.result)
      const _pendingInUSD = _pending * (index === 0 ? xFlackPrice : ethUsdtLpPrice)
      _totalPending += _pendingInUSD
      return {
        name: distributedTokenInfo[index].tokenName,
        pendingReward: _pending,
        pendingRewardInUSD: _pendingInUSD,
      }
    })
    setPendingRewardData(_pendingRewardData)
    setTotalPendingRewardInUSD(_totalPending)
  }, [contractResult, xFlackPrice, ethUsdtLpPrice])

  return {
    pendingRewardData,
    totalPendingRewardInUSD,
    refetchContracts,
  }
}
