import { getLpTokenPrice } from '@pancakeswap/farms/farmPrices'
import { ChainId, WETH9, pancakePairV2ABI } from '@pancakeswap/sdk'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { STABLE_COIN } from '@pancakeswap/tokens'
import { nftPoolABI } from 'config/abi/nftPool'
import { flackMasterABI } from 'config/abi/IFlackMaster'
import { flackYieldBoosterABI } from 'config/abi/IFlackYieldBooster'
import { FLACK_ADDRESS, FLACK_MASTER, YIELD_BOOSTER_ADDRESS } from 'config/constants/kakarot'
import { useCurrency } from 'hooks/Tokens'
import { useLpPrice } from 'hooks/useLpPirce'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { useEffect, useMemo, useState } from 'react'
import { getContractArrayResult, getContractResult, parseNumber } from 'utils/flackHelper'
import { useAccount, useContractReads } from 'wagmi'
import { useStableLpPrice } from 'hooks/useStableLpPirce'
import { useFsNFTAprs } from 'hooks/useFsNFTAprs'

export interface FsNFTData {
  poolAddress: string
  name: string
  type: string
  nftId: number
  depositedLp: number
  totalLpInPool: number
  pending: number
  pendingUSD: number
  startLockTime: number
  lockDuration: number
  pairAddress: string
  lpTotalSupply: number
  boostPoints: number
  token0: Currency
  token1: Currency
  ethPrice: number
  lpBalanceInWallet: number
  value: number
  allocPoint: number
  farmBaseAPR: number
  boostBonusAPR: number
  lockBonusAPR: number
  flackPrice: number
  lpPrice: number
  userAllocation: number
  poolAllocation: number
  totalAllocation: number
  boostMultiplier: number
}

export const useFsNFTCardData = ({ fsNft, ethPrice }) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const [data, setData] = useState<FsNFTData | undefined>(undefined)

  const token0 = useCurrency(fsNft.pool.pair?.token0.id)
  const token1 = useCurrency(fsNft.pool.pair?.token1.id)

  const flackPrice = useTokenPriceBaseStableCoin(FLACK_ADDRESS)

  const { lpPrice: stableLpPrice } = useStableLpPrice(fsNft.pool.pair)
  const { lpPrice: v2LpPrice } = useLpPrice(
    fsNft.pool.pair?.token0.id.toLowerCase() === STABLE_COIN[chainId ?? ChainId.BLOCKSPOT_TESTNET].address.toLowerCase()
      ? fsNft.pool.pair?.token1.id
      : fsNft.pool.pair?.token0.id,
    fsNft.pool.pairAddress,
  )

  const lpPrice = fsNft.pool.pair?.router === undefined ? v2LpPrice : stableLpPrice

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: fsNft.pool.id,
        abi: nftPoolABI,
        functionName: 'pendingRewards',
        args: [fsNft.nftId],
      },
      {
        address: fsNft.pool.pairAddress,
        abi: pancakePairV2ABI,
        functionName: 'balanceOf',
        args: [account as `0x${string}`],
      },
      {
        address: FLACK_MASTER,
        abi: flackMasterABI,
        functionName: 'getPoolInfo',
        args: [fsNft.pool.id],
      },
      {
        address: FLACK_MASTER,
        abi: flackMasterABI,
        functionName: 'totalAllocPoint',
      },
      {
        address: FLACK_MASTER,
        abi: flackMasterABI,
        functionName: 'emissionRate',
      },
      {
        address: fsNft.pool.id,
        abi: nftPoolABI,
        functionName: 'getMultiplierByLockDuration',
        args: [fsNft.lockDuration],
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: flackYieldBoosterABI,
        functionName: 'getUserPositionAllocation',
        args: [account, fsNft.pool.id, fsNft.nftId],
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: flackYieldBoosterABI,
        functionName: 'getPoolTotalAllocation',
        args: [fsNft.pool.id],
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: flackYieldBoosterABI,
        functionName: 'totalAllocation',
      },
      {
        address: fsNft.pool.id,
        abi: nftPoolABI,
        functionName: 'getMultiplierByBoostPoints',
        args: [fsNft.amount, (fsNft.boostPoints * 10 ** 18) as unknown as bigint],
      },
    ],
  })

  const { apr, boostBonusApr, lockBonusAPR } = useFsNFTAprs(
    fsNft.pool.id,
    flackPrice,
    lpPrice,
    fsNft.nftId,
    fsNft.lockDuration,
    fsNft.amount,
  )

  useEffect(() => {
    if (!token0 || !token1) return
    if (!contractResult) return
    if (!flackPrice) return

    const getCardData = async () => {
      setData({
        poolAddress: fsNft.pool.id,
        name: fsNft.pool.pair?.name,
        type: fsNft.pool.pair?.router === undefined ? 'V2' : 'Stable',
        nftId: fsNft.nftId,
        depositedLp: fsNft.amount,
        totalLpInPool: fsNft.pool.totalLiquidity,
        pending: getContractResult(contractResult[0]),
        pendingUSD:
          flackPrice === null
            ? getContractResult(contractResult[0])
            : getContractResult(contractResult[0]) * flackPrice,
        startLockTime: fsNft.startLockTime,
        lockDuration: fsNft.lockDuration,
        pairAddress: fsNft.pool.pairAddress,
        lpTotalSupply: fsNft.pool.pair?.totalSupply,
        boostPoints: fsNft.boostPoints,
        token0: token0 as Currency,
        token1: token1 as Currency,
        ethPrice: ethPrice.ethPrice,
        lpBalanceInWallet: getContractResult(contractResult[1]),
        value: lpPrice * fsNft.amount,
        allocPoint: getContractArrayResult(contractResult[2], 1, 0),
        flackPrice,
        lpPrice,
        farmBaseAPR: apr ?? 0,
        boostBonusAPR: boostBonusApr ?? 0,
        lockBonusAPR: lockBonusAPR ?? 0,
        userAllocation: getContractResult(contractResult[6]),
        poolAllocation: getContractResult(contractResult[7]),
        totalAllocation: getContractResult(contractResult[8]),
        boostMultiplier: getContractResult(contractResult[9]) / 10000 + 1,
      })
    }

    getCardData()
  }, [contractResult, fsNft, flackPrice, token0, token1, apr, boostBonusApr, lockBonusAPR])

  return useMemo(() => {
    return {
      data,
      refetchContracts,
    }
  }, [data, refetchContracts])
}
