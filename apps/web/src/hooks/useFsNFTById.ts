import useSWRImmutable from 'swr/immutable'
import { useEffect, useMemo, useState } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/kakarot'
import { FsNFTData } from 'views/Positions/hooks/useFsNFTCardData'

const query = gql`
  query MyQuery($nftId: BigInt, $poolId: ID) {
    stakingPositions(where: { nftId: $nftId, pool_: { id: $poolId } }) {
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
export default function useFsNFTById(poolId: string | undefined, nftId: string | undefined, interval: number = 30000) {
  // if(!poolId || !poolId) return
  const {
    data: queryResult,
    isLoading: isQueryLoading,
    error,
  } = useSWRImmutable(
    poolId && positionsSubgraphClient ? `useFsNFTListsById-${poolId}` : null,
    async () => {
      return positionsSubgraphClient.request(query, {
        poolId: poolId?.toLowerCase(),
        nftId: nftId?.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )

  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!nftId || !poolId || isQueryLoading || !queryResult) return
    setIsLoading(false)
    const _data = queryResult.stakingPositions
    if (!queryResult.stakingPositions || queryResult.stakingPositions.length <= 0) return
    setData(_data[0])
  }, [queryResult, isQueryLoading, poolId, nftId])

  return {
    data,
    isLoading,
  }
}
