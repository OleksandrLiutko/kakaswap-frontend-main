import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { erc20ABI, useContractReads } from 'wagmi'
import { useTokenPriceBaseStableCoin } from './useTokenPriceBaseStableCoin'

export const useLpPrice = (tokenAddress, lpAddress) => {
  const [lpPrice, setLpPrice] = useState<number>(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [lpAddress],
      },
      {
        address: lpAddress,
        abi: erc20ABI,
        functionName: 'totalSupply',
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'decimals',
      },
    ],
  })

  const tokenPrice = useTokenPriceBaseStableCoin(tokenAddress)

  useEffect(() => {
    const getTokenPrice = async () => {
      if (!contractResult) return
      const _tokenBalanceInLp = getContractResult(contractResult[0], getContractResult(contractResult[2], 0))
      const _lpTotalSupply = getContractResult(contractResult[1])

      const _lpPrice = _lpTotalSupply === 0 ? 0 : ((tokenPrice ?? 0) * _tokenBalanceInLp * 2) / _lpTotalSupply
      setLpPrice(_lpPrice)
    }
    getTokenPrice()
  }, [contractResult, tokenPrice])

  return {
    lpPrice,
  }
}
