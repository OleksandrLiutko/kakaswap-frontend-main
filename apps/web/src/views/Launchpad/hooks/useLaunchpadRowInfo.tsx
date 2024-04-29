import { fairAuctionABI } from 'config/abi/fairAuction'
import { useEffect, useState } from 'react'
import { getContractResult, getFormattedUnits } from 'utils/flackHelper'
import { useAccount, useContractReads } from 'wagmi'

export interface LaunchpadRowInfo {
  projectToken: `0x${string}`
  projectToken1: `0x${string}`
  hardcapMeet: boolean
  whitelist: boolean
  status: 'Active' | 'Ended' | 'Coming Soon'
  totalRaised: number
  saleAsset: string
  yourAllocation: number
}

export const useLaunchpadRowInfo = (rowData) => {
  const { address } = useAccount()
  const [launchpadRowInfo, setLaunchpadRowInfo] = useState<LaunchpadRowInfo | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: rowData.address,
        abi: fairAuctionABI,
        functionName: 'PROJECT_TOKEN',
      },
      {
        address: rowData.address,
        abi: fairAuctionABI,
        functionName: 'PROJECT_TOKEN_2',
      },
      {
        address: rowData.address,
        abi: fairAuctionABI,
        functionName: 'SALE_TOKEN',
      },
      {
        address: rowData.address,
        abi: fairAuctionABI,
        functionName: 'hasEnded',
      },
      {
        address: rowData.address,
        abi: fairAuctionABI,
        functionName: 'hasStarted',
      },
      {
        address: rowData.address,
        abi: fairAuctionABI,
        functionName: 'MAX_RAISE_AMOUNT',
      },
      {
        address: rowData.address,
        abi: fairAuctionABI,
        functionName: 'totalRaised',
      },
      {
        address: rowData.address,
        abi: fairAuctionABI,
        functionName: 'userInfo',
        args: [address as `0x${string}`],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (!contractResult[7].result) return
    setIsLoading(false)
    const hasEnded = contractResult[3].result
    const hasStarted = contractResult[4].result
    const maxRaiseAmount = getContractResult(contractResult[5], rowData.saleTokenDecimals)
    const totalRaised = getContractResult(contractResult[6], rowData.saleTokenDecimals)
    const _rowInfo: LaunchpadRowInfo = {
      projectToken: contractResult[0].result as `0x${string}`,
      projectToken1: contractResult[1].result as `0x${string}`,
      saleAsset: contractResult[2].result as `0x${string}`,
      status: hasEnded ? 'Ended' : hasStarted ? 'Active' : 'Coming Soon',
      hardcapMeet: totalRaised >= maxRaiseAmount,
      totalRaised,
      yourAllocation: getFormattedUnits(contractResult[7].result[1], rowData.saleTokenDecimals),
      whitelist: rowData.isWhitelist,
    }
    setLaunchpadRowInfo(_rowInfo)
  }, [contractResult, rowData])

  return { isLoading, launchpadRowInfo }
}
