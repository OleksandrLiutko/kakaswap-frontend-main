import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/flack'

const query = gql`
  query MyQuery($owner: String!) {
    stakingPositions(where: { owner: $owner }) {
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
    bundles {
      ethPrice
    }
  }
`

// Philip TODO: add FeeTierDistributionQuery type
export default function useFsNFTListsByAccount(account: string | undefined, interval: number) {
  const { data, isLoading, error } = useSWRImmutable(
    account && positionsSubgraphClient ? `useFsNFTListsByAccount-${account}` : null,
    async () => {
      return positionsSubgraphClient.request(query, {
        owner: account?.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )

  return useMemo(
    () => ({
      error,
      isLoading,
      data,
    }),
    [data, error, isLoading],
  )
}

// const { pools: poolsFromSubgraph } = await client.request<{ pools: V3PoolSubgraphResult[] }>(queryV3Pools, {
//     pageSize: 1000,
//     poolAddrs: addresses,
//   })
