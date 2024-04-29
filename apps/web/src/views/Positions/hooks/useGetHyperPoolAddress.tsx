import useSWRImmutable from 'swr/immutable'
import { useEffect, useMemo, useState } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/flack'
import { STABLE_PAIRS } from 'config/constants/stablePairs'

const getHyperPools = gql`
  query MyQuery($nftPool: String) {
    hyperPools(where: { nftPool: $nftPool, published: true }) {
      id
      nftPool {
        id
        pairAddress
        pair {
          id
          name
          token0 {
            id
            name
            symbol
          }
          token1 {
            id
            name
            symbol
          }
        }
      }
    }
  }
`

// Philip TODO: add FeeTierDistributionQuery type
export default function useGetHyperPoolAddress(nftPoolId: string | undefined, interval: number) {
  const {
    data: queryResult,
    isLoading: isLoadingHyperPoolsData,
    error: errorHyperPoolsData,
  } = useSWRImmutable(
    nftPoolId && positionsSubgraphClient ? `hyperPoolsData-${nftPoolId}` : null,
    async () => {
      return positionsSubgraphClient.request(getHyperPools, {
        nftPool: nftPoolId?.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )

  const [pools, setPools] = useState<string[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoadingHyperPoolsData) return
    setIsLoading(false)
    if (!queryResult) return
    const _hyperPools = queryResult.hyperPools
    if (!_hyperPools || _hyperPools.length === 0) return
    
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
        nftPoolId: item.nftPool.id,
        pair,
      }
    })
    setPools(_hyperPoolDataRow)
  }, [queryResult, isLoadingHyperPoolsData, errorHyperPoolsData])

  return { isLoading, pools }
}
