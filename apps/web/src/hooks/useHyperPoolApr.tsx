import { DAY_IN_SECONDS, YEAR_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import { hyperPoolABI } from 'config/abi/hyperPool'
import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { useContractReads } from 'wagmi'

export const useHyperPoolApr = (
  hyperPoolAddress,
  depositedAssetPrice,
  rewardsToken1Price,
  rewardsToken2Price,
  rewardsToken1Decimals,
  rewardsToken2Decimals,
) => {
  const [apr1, setApr1] = useState<number | undefined>(undefined)
  const [apr2, setApr2] = useState<number | undefined>(undefined)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: hyperPoolAddress,
        abi: hyperPoolABI,
        functionName: 'rewardsToken1PerSecond',
      },
      {
        address: hyperPoolAddress,
        abi: hyperPoolABI,
        functionName: 'rewardsToken2PerSecond',
      },
      {
        address: hyperPoolAddress,
        abi: hyperPoolABI,
        functionName: 'totalDepositAmount',
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (!hyperPoolAddress) return
    if (!depositedAssetPrice) return
    if (!rewardsToken1Price) return

    const rewardsToken1PerSecond = getContractResult(contractResult[0], rewardsToken1Decimals)
    const rewardsToken2PerSecond = getContractResult(contractResult[1], rewardsToken2Decimals)
    const totalDepositAmount = getContractResult(contractResult[2])

    if (totalDepositAmount === 0) return

    const _apr1 =
      ((rewardsToken1PerSecond * rewardsToken1Price) / (totalDepositAmount * depositedAssetPrice)) * YEAR_IN_SECONDS
    setApr1(_apr1)

    if (!rewardsToken2Price) return
    const _apr2 =
      ((rewardsToken2PerSecond * rewardsToken2Price) / (totalDepositAmount * depositedAssetPrice)) * YEAR_IN_SECONDS
    setApr2(_apr2)
  }, [
    contractResult,
    depositedAssetPrice,
    rewardsToken1Price,
    rewardsToken2Price,
    rewardsToken1Decimals,
    rewardsToken2Decimals,
    hyperPoolAddress,
  ])

  return {
    apr1,
    apr2,
  }
}
