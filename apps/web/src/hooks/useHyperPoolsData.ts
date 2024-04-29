import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/flack'

const query = gql`
  query MyQuery($owner: String!) {
    hyperPoolStakingPositions(where: { owner: $owner }) {
      owner
      nftId
      depositedAmount
      hyperPool {
        id
        nftPool {
          id
          pairAddress
        }
      }
    }
    _meta {
      block {
        number
      }
    }
    hyperPools {
      owner
      nftPool {
        id
      }
      totalDepositedNfts
      totalDepositAmount
      rewardsToken1RemainingAmount
      rewardsToken1Amount
      rewardsToken0RemainingAmount
      rewardsToken0Amount
      publishedAt
      published
      endTime
      description
      depositEndTime
      id
    }
  }
`

// Philip TODO: add useHyperPoolsData type
export default function useHyperPoolsData(account: string | undefined, interval: number) {
  const { data, isLoading, error } = useSWRImmutable(
    account && positionsSubgraphClient ? `useHyperPoolsData-${account}` : null,
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
