import { formatUnits } from '@pancakeswap/utils/viem/formatUnits'
import { fairAuctionABI } from 'config/abi/fairAuction'
import { useEffect, useState } from 'react'
import { getContractResult, getFormattedUnits } from 'utils/flackHelper'
import { useAccount, useContractReads } from 'wagmi'
import { LaunchListProps } from '../config'

export interface LaunchpadDetailInfo {
  address: `0x${string}`
  projectToken1: `0x${string}`
  projectToken2: `0x${string}`
  hardcapMeet: boolean
  whitelist: boolean
  status: 'Active' | 'Ended' | 'Coming Soon' | 'Claims'
  totalRaised: number
  maxRaiseAmount: number
  saleAsset: string
  yourContribution: number
  maxTokensToDistribute1: number
  maxTokensToDistribute2: number
  maxContributeAmount: number
  startTime: number
  remainingTime: number
  expectedClaim1Amount: number
  expectedClaim2Amount: number
  refEarning: number
  claimedRefEarning: number
  claimed: boolean
  saleTokenDecimals: number
  projectToken1Decimals: number
  projectToken2Decimals: number
  forceClaimable: boolean
  totalLpSupply: number
  lpAddress: `0x${string}`
}

export const useLaunchpadDetailInfo = (launchpadAddress, initialData: LaunchListProps | undefined) => {
  const { address } = useAccount()
  const [launchpadDetailInfo, setLaunchpadDetailInfo] = useState<LaunchpadDetailInfo | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        // 0
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'PROJECT_TOKEN',
      },
      {
        // 1
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'PROJECT_TOKEN_2',
      },
      {
        // 2
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'SALE_TOKEN',
      },
      {
        // 3
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'hasEnded',
      },
      {
        // 4
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'hasStarted',
      },
      {
        // 5
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'MAX_RAISE_AMOUNT',
      },
      {
        // 6
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'totalRaised',
      },
      {
        // 7
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'userInfo',
        args: [address as `0x${string}`],
      },
      {
        // 8
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'MAX_PROJECT_TOKENS_TO_DISTRIBUTE',
      },
      {
        // 9
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'getRemainingTime',
      },
      {
        // 10
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'getExpectedClaimAmount',
        args: [address as `0x${string}`],
      },
      {
        // 11
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'CAP_PER_WALLET',
      },
      {
        // 12
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'START_TIME',
      },
      {
        // 13
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'MAX_PROJECT_TOKENS_2_TO_DISTRIBUTE',
      },
      {
        // 14
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'forceClaimable',
      },
      {
        // 15
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'totalLpSupply',
      },
      {
        // 16
        address: launchpadAddress,
        abi: fairAuctionABI,
        functionName: 'LP_TOKEN',
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (!contractResult[7].result) return
    if (!contractResult[10].result) return
    if (!initialData) return

    setIsLoading(false)
    const hasEnded = contractResult[3].result
    const hasStarted = contractResult[4].result
    const maxRaiseAmount = getContractResult(contractResult[5], initialData.saleTokenDecimals)
    const totalRaised = getContractResult(contractResult[6], initialData.saleTokenDecimals)
    const maxTokensToDistribute1 = getContractResult(contractResult[8], initialData.projectToken1Decimals)
    const maxTokensToDistribute2 = getContractResult(contractResult[13], initialData.projectToken2Decimals)
    const forceClaimable = contractResult[14].result as boolean
    const totalLpSupply = getContractResult(contractResult[15])
    const isClaimable = hasEnded && (forceClaimable || totalLpSupply > 0)
    const _rowInfo: LaunchpadDetailInfo = {
      address: initialData.address,
      projectToken1: contractResult[0].result as `0x${string}`,
      projectToken2: contractResult[1].result as `0x${string}`,
      saleAsset: contractResult[2].result as `0x${string}`,
      status: isClaimable ? 'Claims' : hasEnded ? 'Ended' : hasStarted ? 'Active' : 'Coming Soon',
      hardcapMeet: totalRaised >= maxRaiseAmount,
      totalRaised,
      maxRaiseAmount,
      yourContribution: getFormattedUnits(contractResult[7].result[1], initialData.saleTokenDecimals),
      whitelist: initialData.isWhitelist,
      maxTokensToDistribute1,
      maxTokensToDistribute2,
      remainingTime: getContractResult(contractResult[9], 0),
      expectedClaim1Amount: Number(formatUnits(contractResult[10].result[0], initialData.projectToken1Decimals)),
      expectedClaim2Amount: Number(formatUnits(contractResult[10].result[1], initialData.projectToken2Decimals)),
      maxContributeAmount: getContractResult(contractResult[11], initialData.saleTokenDecimals),
      startTime: getContractResult(contractResult[12], 0),
      refEarning: getFormattedUnits(contractResult[7].result[5], initialData.saleTokenDecimals),
      claimedRefEarning: getFormattedUnits(contractResult[7].result[6], initialData.saleTokenDecimals),
      claimed: contractResult[7].result[7],
      saleTokenDecimals: initialData.saleTokenDecimals,
      projectToken1Decimals: initialData.projectToken1Decimals,
      projectToken2Decimals: initialData.projectToken2Decimals,
      forceClaimable,
      totalLpSupply,
      lpAddress: contractResult[16].result as `0x${string}`,
    }
    setLaunchpadDetailInfo(_rowInfo)
  }, [contractResult, initialData])

  return { isLoading, launchpadDetailInfo, refetchContracts }
}
