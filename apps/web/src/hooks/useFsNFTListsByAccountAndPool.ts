import useSWRImmutable from 'swr/immutable'
import { useEffect, useMemo, useState } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/kakarot'
import { STABLE_PAIRS } from 'config/constants/stablePairs'

const query = gql`
  query MyQuery($owner: String, $pool: String) {
    stakingPositions(where: { owner: $owner, pool: $pool, amount_gt: "0" }) {
      startLockTime
      owner
      nftId
      lockDuration
      id
      distroied
      boostPoints
      amount
      pool {
        id
        pairAddress
        totalLiquidity
        pair {
          volumeUSD
          volumeToken1
          volumeToken0
          untrackedVolumeUSD
          trackedReserveETH
          totalSupply
          token1Price
          token1 {
            id
            name
            symbol
          }
          token0Price
          token0 {
            id
            symbol
            name
          }
          name
        }
      }
    }
  }
`

// Philip TODO: add FeeTierDistributionQuery type
export default function useFsNFTListsByAccountAndPool(
  account: string | undefined,
  poolId: string | undefined,
  interval: number = 30000,
) {
  // if(!account || !poolId) return
  const {
    data: queryResult,
    isLoading: isQueryLoading,
    error,
  } = useSWRImmutable(
    account && poolId && positionsSubgraphClient ? `useFsNFTListsByAccountAndPool-${account}-${poolId}` : null,
    async () => {
      return positionsSubgraphClient.request(query, {
        owner: account?.toLowerCase(),
        pool: poolId?.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )
  
  const [data, setData] = useState<any[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!poolId || isQueryLoading || !queryResult) return
    setIsLoading(false)
    const _stakingPositions = queryResult.stakingPositions
    if (!_stakingPositions) return

    const _data = _stakingPositions.map((item) => {
      let pair = item.pool.pair
      let isStable = false
      
      if (pair == null) {
        for (let i = 0; i < STABLE_PAIRS.length; i++) {
          if (STABLE_PAIRS[i].id.toLowerCase() === item.pool.pairAddress) {
            pair = STABLE_PAIRS[i]
            isStable = true
            break
          }
        }
      }

      return {
        ...item,
        isStable
      }
    })

    setData(_data)
  }, [queryResult, isQueryLoading, poolId])

  return {
    data,
    isLoading,
  }
}
