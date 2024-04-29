import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/flack'

const query = gql`
  query MyQuery {
    pools {
      id
      pairAddress
    }
  }
`

export default function useFsNftList(interval: number) {
  const { data, isLoading, error } = useSWRImmutable(
    `useFsNftList-1`,
    async () => {
      return positionsSubgraphClient.request(query, {})
    },
    {
      refreshInterval: interval,
    },
  )

  return useMemo(() => {
    return {
      error,
      isLoading,
      data,
    }
  }, [data, error, isLoading])
}
