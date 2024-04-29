import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/flackHelper'
import { erc20ABI, useAccount, useContractReads } from 'wagmi'

export const useAllowance = (tokenAddress, spenderAddress) => {
  const { address } = useAccount()
  const [allowance, setAllowance] = useState<number>(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address as `0x${string}`, spenderAddress],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    setAllowance(getContractResult(contractResult[1], contractResult[0].result))
  }, [contractResult])
  return { allowance, refetchAllowance: refetchContracts }
}
