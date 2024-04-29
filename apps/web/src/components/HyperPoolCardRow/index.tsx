import { Text, Flex, Grid, EAlarmClock, ELockIcon, EWhiteList, EDepositIcon, useTooltip } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { styled } from 'styled-components'
import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { Percent, Currency, ChainId } from '@pancakeswap/sdk'

import { useCurrency } from 'hooks/Tokens'
import { HyperPoolDataRow } from 'hooks/useHyperPools'
import { CurrencyLogo } from 'components/Logo'
import { useRewards } from 'views/HyperPools/hooks/useRewards'
import { formatAmount } from 'utils/formatCurrencyAmount'
import { useEffect, useState } from 'react'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { FLACK_ADDRESS } from 'config/constants/flack'
import { useLpPrice } from 'hooks/useLpPirce'
import { useHyperPoolApr } from 'hooks/useHyperPoolApr'
import { useFsNFTAprs } from 'hooks/useFsNFTAprs'
import { useStableLpPrice } from 'hooks/useStableLpPirce'
import { STABLE_COIN } from '@pancakeswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'

const TableRow = styled(Grid)`
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 1.2fr 1.2fr;
  padding: 8px 4px;
  transition: background 0.3s;
  cursor: pointer;

  &:hover {
    background: #33333333;
  }

  > div {
    font-size: 13px;
    color: gray;
    display: flex;
    align-items: center;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 3fr 1fr 1fr 1.2fr 1.2fr;
    .tbl-tvl,
    .tbl-requirements {
      display: none;
    }
  }

  @media screen and (max-width: 680px) {
    grid-template-columns: 2fr 1fr 1fr;
    .tbl-tvl,
    .tbl-incentive,
    .tbl-requirements,
    .tbl-deposit {
      display: none;
    }
  }
`

interface HyperPoolCardRowProps {
  poolData: HyperPoolDataRow
  onClick?: () => void
}

export const HyperPoolCardRow = ({ poolData, onClick }: HyperPoolCardRowProps) => {
  const { chainId } = useActiveChainId()
  const currency0 = useCurrency(poolData.token0Address) as Currency
  const currency1 = useCurrency(poolData.token1Address) as Currency
  const currencyReward1 = useCurrency(poolData.rewardsToken0.id) as Currency
  const currencyReward2 = useCurrency(poolData.rewardsToken1.id) as Currency

  const rewardsToken1Price = useTokenPriceBaseStableCoin(poolData?.rewardsToken0.id as string)
  const rewardsToken2Price = useTokenPriceBaseStableCoin(poolData?.rewardsToken1.id as string)
  const flackPrice = useTokenPriceBaseStableCoin(FLACK_ADDRESS)
  // const { lpPrice } = useLpPrice(poolData?.token0Address, poolData?.pairAddress as string)

  const { lpPrice: stableLpPrice } = useStableLpPrice(poolData?.pair)
  const { lpPrice: v2LpPrice } = useLpPrice(
    poolData.pair.token0.id === STABLE_COIN[chainId ?? ChainId.BLOCKSPOT_TESTNET].address.toLowerCase()
      ? poolData.pair.token1.id
      : poolData.pair.token0.id,
    poolData?.pairAddress,
  )

  const lpPrice = poolData.pair.router === undefined ? v2LpPrice : stableLpPrice

  const { apr: fsNFTApr } = useFsNFTAprs(poolData?.nftPoolAddress, flackPrice, lpPrice)
  const { apr1, apr2 } = useHyperPoolApr(
    poolData.id,
    lpPrice,
    rewardsToken1Price,
    rewardsToken2Price,
    poolData?.rewardsToken0.decimals,
    poolData?.rewardsToken1.decimals,
  )

  const { pendingReward1, pendingReward2 } = useRewards(
    poolData.id,
    poolData.rewardsToken0.decimals,
    poolData.rewardsToken1.decimals,
  )

  const [tvl, setTvl] = useState(0)
  const [apr, setApr] = useState(0)
  const [totalDepositAmount, setTotalDepositAmount] = useState(0)

  const [depositAmountReq, setDepositAmountReq] = useState(false)
  const [lockDurationReq, setLockDurationReq] = useState(false)
  const [lockEndReq, setLockEndReq] = useState(false)
  const [whitelistReq, setWhitelistReq] = useState(false)

  const {
    targetRef: targetRefLock,
    tooltip: tooltipLock,
    tooltipVisible: tooltipVisibleLock,
  } = useTooltip('Lock duration requirement', { placement: 'auto-start', hideTimeout: 0 })
  const {
    targetRef: targetRefMin,
    tooltip: tooltipMin,
    tooltipVisible: tooltipVisibleMin,
  } = useTooltip('Min deposit amount requirement', { placement: 'auto-start', hideTimeout: 0 })
  const {
    targetRef: targetRefEnd,
    tooltip: tooltipEnd,
    tooltipVisible: tooltipVisibleEnd,
  } = useTooltip('Lock end date requirement', { placement: 'auto-start', hideTimeout: 0 })
  const {
    targetRef: targetRefWhite,
    tooltip: tooltipWhite,
    tooltipVisible: tooltipVisibleWhite,
  } = useTooltip('Whitelist requirement', { placement: 'auto-start', hideTimeout: 0 })

  useEffect(() => {
    if (!poolData) return

    setDepositAmountReq(Number(poolData.depositAmountReq) > 0)
    setLockDurationReq(Number(poolData.lockDurationReq) > 0)
    setLockEndReq(Number(poolData.lockEndReq) > 0)
    setWhitelistReq(poolData.whitelist)
    const _totalDeposit =
      poolData.userStakingPositions?.reduce((prev, next) => prev + Number(next.depositedAmount), 0) ?? 0
    setTotalDepositAmount(_totalDeposit * lpPrice)
  }, [poolData, lpPrice])

  useEffect(() => {
    let _apr = 0
    _apr += fsNFTApr ?? 0
    _apr += apr1 ?? 0
    _apr += apr2 ?? 0
    setApr(_apr)
  }, [fsNFTApr, apr1, apr2])

  useEffect(() => {
    if (!poolData || !poolData.totalDepositAmount || !lpPrice) return
    setTvl(poolData.totalDepositAmount * lpPrice)
  }, [poolData, lpPrice])

  return (
    <NextLink href={`/hyperpools/${poolData.id}`}>
      <TableRow>
        <Flex alignItems="center" mb="4px" flexWrap="wrap">
          <Flex width={['100%', '100%', 'inherit']} pr="8px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text bold ml="8px">
              {poolData.pairName} {poolData.pair.router === undefined ? 'V2' : 'Stable'}
            </Text>
          </Flex>
        </Flex>

        <Text className="tbl-tvl">${Number(tvl.toFixed(2))}</Text>

        <Flex className="tbl-incentive">
          {currencyReward1 && <CurrencyLogo currency={currencyReward1} size="20px" />}
          {currencyReward2 && <CurrencyLogo currency={currencyReward2} size="20px" />}
        </Flex>

        <Text>{Number(apr.toFixed(2))}%</Text>

        <Flex className="tbl-requirements" style={{ gap: '8px' }}>
          <Flex ref={targetRefLock}>
            <ELockIcon color={lockDurationReq ? 'white' : 'gray'} width={16} height={16} />
          </Flex>
          <Flex ref={targetRefEnd}>
            <EAlarmClock color={lockEndReq ? 'white' : 'gray'} width={16} height={16} />
          </Flex>
          <Flex ref={targetRefMin}>
            <EDepositIcon color={depositAmountReq ? 'white' : 'gray'} width={16} height={16} mt="2px" />
          </Flex>
          <Flex ref={targetRefWhite}>
            <EWhiteList color={whitelistReq ? 'white' : 'gray'} width={16} height={16} />
          </Flex>
          {tooltipVisibleLock && tooltipLock}
          {tooltipVisibleEnd && tooltipEnd}
          {tooltipVisibleMin && tooltipMin}
          {tooltipVisibleWhite && tooltipWhite}
        </Flex>

        <Text fontSize="12px" className="tbl-deposit">
          ${formatAmount(totalDepositAmount)}
        </Text>

        <Flex flexDirection={'column'}>
          {pendingReward1 && pendingReward1 > 0 ? (
            <Text fontSize="12px">
              {formatAmount(pendingReward1)} {poolData?.rewardsToken0?.symbol}
            </Text>
          ) : null}
          {pendingReward2 && pendingReward2 > 0 ? (
            <Text fontSize="12px">
              {formatAmount(pendingReward2)} {poolData?.rewardsToken1?.symbol}
            </Text>
          ) : null}
        </Flex>
      </TableRow>
    </NextLink>
  )
}
