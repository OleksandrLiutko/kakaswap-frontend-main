import { ChainId } from '@pancakeswap/chains'
import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { erc20ABI, useContractReads } from 'wagmi'
import { WETH9 } from '@pancakeswap/sdk'
import { FLACK_ADDRESS, XFLACK_ADDRESS } from 'config/constants/kakarot'
import { getEthPrice } from './useETHPrice'
import { useActiveChainId } from './useActiveChainId'

export const useTokenPrice = (tokenAddress: string, lpAddress) => {
  const [tokenPrice, setTokenPrice] = useState<number>(0)
  const { chainId } = useActiveChainId()

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: (tokenAddress.toLowerCase() === XFLACK_ADDRESS.toLocaleLowerCase()
          ? FLACK_ADDRESS
          : tokenAddress) as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [lpAddress],
      },
      {
        address: WETH9[chainId].address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [lpAddress],
      },
    ],
  })

  useEffect(() => {
    const getTokenPrice = async () => {
      if (!contractResult) return
      const _ethPrice = Number(await getEthPrice())
      if (!_ethPrice) return
      const _tokenBalanceInLp = getContractResult(contractResult[0])
      const _wethBalanceInLp = getContractResult(contractResult[1])
      const _tokenPrice = _tokenBalanceInLp === 0 ? 0 : (_ethPrice * _wethBalanceInLp) / _tokenBalanceInLp
      setTokenPrice(_tokenPrice)
    }
    getTokenPrice()
  }, [contractResult])

  return {
    tokenPrice,
  }
}
