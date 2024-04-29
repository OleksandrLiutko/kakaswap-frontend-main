import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/kakarot'
import { stableSwapClient } from 'utils/graphql'
import { STABLE_PAIRS } from 'config/constants/stablePairs'
import { useStableSwapPairs } from 'state/swap/useStableSwapPairs'

const query = gql`
  query MyQuery {
    pairs {
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
`

export default function usePairList(interval: number) {
  const {
    data: v2data,
    isLoading: v2isLoading,
    error: v2error,
  } = useSWRImmutable(
    `usePairV2List-1`,
    async () => {
      return positionsSubgraphClient.request(query, {})
    },
    {
      refreshInterval: interval,
    },
  )

  return useMemo(() => {
    if (v2data === undefined || v2isLoading || v2error) return { data: undefined }

    return { data: { pairs: [...v2data.pairs, ...STABLE_PAIRS] } }
  }, [v2data, v2isLoading, v2error])
}
