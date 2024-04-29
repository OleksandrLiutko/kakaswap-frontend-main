import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { erc20ABI, useContractReads } from 'wagmi'

export interface PairData {
  name: string
  id: string
  router: string
  balance: number
  token0: {
    id: string
    name: string
    symbol: string
  }
  token1: {
    id: string
    name: string
    symbol: string
  }
}

export const usePairData = ({ account, pairs }) => {
  const [data, setData] = useState<PairData[] | undefined>(undefined)

  const { data: contractResult } = useContractReads({
    contracts: pairs?.map(
      (f) =>
        ({
          abi: erc20ABI,
          address: f.id,
          functionName: 'balanceOf',
          args: [account],
        } as const),
    ),
    watch: true,
  })

  useEffect(() => {
    if (!contractResult) return
    if (!pairs) return

    const ret = pairs.map((item, key) => {
      return { ...item, balance: getContractResult(contractResult[key]) }
    })

    setData(ret)
  }, [pairs, account, contractResult])

  return { data }
}
