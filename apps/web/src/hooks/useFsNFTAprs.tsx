import { YEAR_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import { parseUnits } from '@pancakeswap/utils/viem/parseUnits'
import { flackMasterABI } from 'config/abi/IFlackMaster'
import { flackYieldBoosterABI } from 'config/abi/IFlackYieldBooster'
import { nftPoolABI } from 'config/abi/nftPool'
import { FLACK_MASTER, YIELD_BOOSTER_ADDRESS } from 'config/constants/kakarot'
import { useEffect, useState } from 'react'
import { getContractArrayResult, getContractResult } from 'utils/flackHelper'
import { useAccount, useContractReads } from 'wagmi'

export const useFsNFTAprs = (nftPoolId, flackPrice, lpPrice, nftId = '0', lockDuration = '0', amount = 0) => {
  const { address: account } = useAccount()
  const [apr, setApr] = useState<number | undefined>(undefined)
  const [lockBonusAPR, setLockBonusApr] = useState<number | undefined>(undefined)
  const [boostBonusApr, setBoostBonusApr] = useState<number | undefined>(undefined)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        // 2
        address: FLACK_MASTER,
        abi: flackMasterABI,
        functionName: 'getPoolInfo',
        args: [nftPoolId],
      },
      {
        // 3
        address: nftPoolId,
        abi: nftPoolABI,
        functionName: 'getPoolInfo',
      },
      {
        address: nftPoolId,
        abi: nftPoolABI,
        functionName: 'getMultiplierByLockDuration',
        args: [parseUnits(lockDuration, 0)],
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: flackYieldBoosterABI,
        functionName: 'getUserPositionAllocation',
        args: [account as `0x${string}`, nftPoolId, parseUnits(nftId, 0)],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (!lpPrice) return
    const poolEmissionRate = getContractArrayResult(contractResult[0], 4)
    const totalDepositAmount = getContractArrayResult(contractResult[1], 5)

    if (!totalDepositAmount) return
    const _apr = ((poolEmissionRate * flackPrice) / (totalDepositAmount * lpPrice)) * YEAR_IN_SECONDS * 100
    setApr(_apr)

    const _lockBonusAPR = (_apr * getContractResult(contractResult[2], 0)) / 10000
    setLockBonusApr(_lockBonusAPR)

    const _boostBonusAPR =
      lpPrice === 0 || amount === 0
        ? 0
        : ((getContractResult(contractResult[3]) * flackPrice) / Number(amount) / lpPrice) * 100
    setBoostBonusApr(_boostBonusAPR)
  }, [contractResult, flackPrice, lpPrice, amount])

  return {
    apr,
    lockBonusAPR,
    boostBonusApr,
  }
}
