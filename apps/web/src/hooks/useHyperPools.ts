import useSWRImmutable from 'swr/immutable'
import { useEffect, useMemo, useState } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/kakarot'
import { STABLE_PAIRS } from 'config/constants/stablePairs'
import { TokenData } from './useHyperPoolData'

const getHyperPoolsQuery = gql`
  query MyQuery($owner: String!) {
    hyperPools(where: { published: true, nftPool_: { id_not: null } }) {
      totalDepositedNfts
      totalDepositAmount
      owner
      id
      whitelist
      startTime
      rewardsToken1RemainingAmount
      rewardsToken1Amount
      rewardsToken0RemainingAmount
      rewardsToken0Amount
      publishedAt
      published
      lockEndReq
      lockDurationReq
      harvestStartTime
      endTime
      description
      depositEndTime
      depositAmountReq
      createdAt
      isExemptedFromFee
      rewardsToken0 {
        decimals
        symbol
        name
        id
      }
      rewardsToken1 {
        decimals
        id
        name
        symbol
      }
      stakingPositions(where: { owner: $owner }) {
        depositedAmount
        nftId
        id
      }
      nftPool {
        id
        pairAddress
        pair {
          token0 {
            id
          }
          token1 {
            id
          }
          name
        }
      }
    }
    _meta {
      block {
        number
      }
    }
    hyperPoolFactories {
      totalexemptedHyperPool
      totalHyperPools
      totalPublishedHyperPools
    }
  }
`

export interface HyperPoolData {
  totalPublishedHyperPools: number
  totalHyperPools: number
  totalexemptedHyperPool: number
  pools: HyperPoolDataRow[] | undefined
}
export interface HyperPoolStakingPositionData {
  id: string
  hyperPool: `0x${string}`
  nftId: number
  depositedAmount: number
}

export interface HyperPoolDataRow {
  id: `0x${string}`
  owner: `0x${string}`
  whitelist: boolean
  totalDepositedNfts: number
  totalDepositAmount: number

  publishedAt: number
  published: boolean
  createdAt: number

  // setting
  startTime: number
  lockEndReq: number
  lockDurationReq: number
  isExemptedFromFee: boolean
  harvestStartTime: number
  endTime: number
  description: string
  depositEndTime: number
  depositAmountReq: number

  rewardsToken1: TokenData
  rewardsToken0: TokenData
  nftPoolAddress: `0x${string}`
  pairAddress: `0x${string}`
  pairName: string
  token0Address: `0x${string}`
  token1Address: `0x${string}`
  userStakingPositions: HyperPoolStakingPositionData[] | null

  pair
}

// Philip TODO: add FeeTierDistributionQuery type
export default function useHyperPools(account: string | undefined, interval: number) {
  const {
    data: hyperPoolsData,
    isLoading: isLoadingHyperPoolsData,
    error: errorHyperPoolsData,
  } = useSWRImmutable(
    account && positionsSubgraphClient ? `hyperPoolsData-${account}` : null,
    async () => {
      return positionsSubgraphClient.request(getHyperPoolsQuery, {
        owner: account?.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )

  const [pools, setPools] = useState<HyperPoolData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoadingHyperPoolsData) return
    setIsLoading(false)
    if (!hyperPoolsData) return
    const _factoryData = hyperPoolsData.hyperPoolFactories
    const _hyperPools = hyperPoolsData.hyperPools
    if (!_hyperPools || !_factoryData || _hyperPools.length === 0 || _factoryData.length === 0) return

    const _hyperPoolDataRow = _hyperPools.map((item) => {
      let pair = item.nftPool.pair

      if (pair == null) {
        for (let i = 0; i < STABLE_PAIRS.length; i++) {
          if (STABLE_PAIRS[i].id.toLowerCase() === item.nftPool.pairAddress) {
            pair = STABLE_PAIRS[i]
            break
          }
        }
      }

      return {
        id: item.id,
        owner: item.owner,
        whitelist: item.whitelist,
        totalDepositedNfts: item.totalDepositedNfts,
        totalDepositAmount: item.totalDepositAmount,
        publishedAt: item.publishedAt,
        published: item.published,
        createdAt: item.createdAt,
        startTime: item.startTime,
        lockEndReq: item.lockEndReq,
        lockDurationReq: item.lockDurationReq,
        isExemptedFromFee: item.isExemptedFromFee,
        harvestStartTime: item.harvestStartTime,
        endTime: item.endTime,
        description: item.description,
        depositEndTime: item.depositEndTime,
        depositAmountReq: item.depositAmountReq,

        rewardsToken1: {
          id: item.rewardsToken1.id,
          name: item.rewardsToken1.name,
          symbol: item.rewardsToken1.symbol,
          decimals: item.rewardsToken1.decimals,
          isLp: false,
          rewardAmount: item.rewardsToken1Amount,
          rewardRemainingAmount: item.rewardsToken1RemainingAmount,
        },
        rewardsToken0: {
          id: item.rewardsToken0.id,
          name: item.rewardsToken0.name,
          symbol: item.rewardsToken0.symbol,
          decimals: item.rewardsToken0.decimals,
          isLp: false,
          rewardAmount: item.rewardsToken0Amount,
          rewardRemainingAmount: item.rewardsToken0RemainingAmount,
        },
        nftPoolAddress: item.nftPool?.id,
        pairAddress: item.nftPool?.pairAddress,
        pairName: pair.name,
        token0Address: pair.token0.id,
        token1Address: pair.token1.id,
        userStakingPositions: item.stakingPositions,
        pair,
      }
    })
    const _poolData: HyperPoolData = {
      totalPublishedHyperPools: _factoryData[0].totalPublishedHyperPools,
      totalHyperPools: _factoryData[0].totalHyperPools,
      totalexemptedHyperPool: _factoryData[0].totalexemptedHyperPool,
      pools: _hyperPoolDataRow,
    }
    setPools(_poolData)
  }, [hyperPoolsData, isLoadingHyperPoolsData, errorHyperPoolsData])

  return { isLoading, pools }
}
