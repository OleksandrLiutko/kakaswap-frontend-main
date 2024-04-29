import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { erc20ABI, useContractReads } from 'wagmi'
import { useTokenPriceBaseStableCoin } from './useTokenPriceBaseStableCoin'

export const useStableLpPrice = (pair) => {
  const [lpPrice, setLpPrice] = useState<number>(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: pair?.id,
        abi: erc20ABI,
        functionName: 'totalSupply',
      },
      {
        address: pair?.token0?.id,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [pair?.router],
      },
      {
        address: pair?.token1?.id,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [pair?.router],
      },
    ],
  })

  const token0Price = useTokenPriceBaseStableCoin(pair?.token0?.id)
  const token1Price = useTokenPriceBaseStableCoin(pair?.token1?.id)

  useEffect(() => {
    const getTokenPrice = async () => {
      if (!contractResult) return
      const _token0BalanceInLp = getContractResult(contractResult[1], pair?.token0.decimals)
      const _token1BalanceInLp = getContractResult(contractResult[2], pair?.token0.decimals)
      const _lpTotalSupply = getContractResult(contractResult[0])

      const _lpPrice =
        _lpTotalSupply === 0
          ? 0
          : ((token0Price ?? 0) * _token0BalanceInLp + (token1Price ?? 0) * _token1BalanceInLp) / _lpTotalSupply
      setLpPrice(_lpPrice)
    }
    getTokenPrice()
  }, [contractResult, token0Price, token1Price, pair])

  return {
    lpPrice,
  }
}
