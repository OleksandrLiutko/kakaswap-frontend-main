import { Text, Card, Flex, Tag, SyncAltIcon, Grid, Box, MinusIcon, AddIcon } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { styled } from 'styled-components'

import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { Percent, Currency } from '@pancakeswap/sdk'
import { useEffect } from 'react'
import { LPStablePair } from 'views/Swap/hooks/useStableConfig'
import { useAccount } from 'wagmi'
import { useTokenBalance } from 'state/wallet/hooks'
import { useInfoStableSwapContract } from 'hooks/useContract'
import { useGetRemovedTokenAmountsNoContext } from 'views/RemoveLiquidity/RemoveStableLiquidity/hooks/useStableDerivedBurnInfo'
import currencyId from 'utils/currencyId'
import { usePoolTokenPercentage, useTotalUSDValue } from 'components/PositionCard'
import useTotalSupply from 'hooks/useTotalSupply'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { useTranslation } from '@pancakeswap/localization'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'

const TableRow = styled(Grid)`
  grid-template-columns: 2.4fr 1fr 1fr 1fr 1.2fr;
  cursor: pointer;
  padding: 4px;
  transition: background 0.3s;
  align-items: center;
  border-radius: 4px;

  &:hover {
    background: #33333333;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    .tbl-amount {
      display: none;
    }
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr;
    .tbl-amount,
    .tbl-fees {
      display: none;
    }
  }
`

interface StableCardRowProps {
  link?: string
  data: LPStablePair
  onSwitch?: () => void
}

export const StableCardRow = ({ link, data, onSwitch }: StableCardRowProps) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { address: account } = useAccount()
  const userPoolBalance = useTokenBalance(account ?? undefined, data?.liquidityToken)

  const stableSwapInfoContract = useInfoStableSwapContract(data?.infoStableSwapAddress)

  const [token0Deposited, token1Deposited] = useGetRemovedTokenAmountsNoContext({
    lpAmount: userPoolBalance?.quotient?.toString(),
    token0: data?.token0.wrapped,
    token1: data?.token1.wrapped,
    stableSwapInfoContract,
    stableSwapAddress: data?.stableSwapAddress,
  })

  const totalUSDValue = useTotalUSDValue({
    currency0: data?.token0,
    currency1: data?.token1,
    token0Deposited,
    token1Deposited,
  })

  const totalPoolTokens = useTotalSupply(data?.liquidityToken)

  const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

  const content = (
    <TableRow>
      <Flex pr="8px">
        <DoubleCurrencyLogo currency0={data?.token0} currency1={data?.token1} size={32} />
        <Flex alignItems="center">
          <Text ml="8px" fontSize="14px">
            {data?.token0.symbol}-{data?.token1.symbol}
          </Text>
          <Text ml="4px" fontSize="12px">
            Stable
          </Text>
        </Flex>
      </Flex>

      <Flex flexDirection="column" className="tbl-amount">
        <Text fontSize="12px">{Number(userPoolBalance?.toSignificant(18)).toFixed(2)}</Text>
        <Text fontSize="12px">
          $
          {totalUSDValue
            ? totalUSDValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '-'}
        </Text>
      </Flex>

      <Flex flexDirection="column">
        <Flex>
          <CurrencyLogo currency={data?.token0} size="16px" />
          <Text fontSize="12px" ml="4px">
            {formatCurrencyAmount(token0Deposited, 4, locale)}
          </Text>
        </Flex>
        <Flex>
          <CurrencyLogo currency={data?.token1} size="16px" />
          <Text fontSize="12px" ml="4px">
            {formatCurrencyAmount(token1Deposited, 4, locale)}
          </Text>
        </Flex>
      </Flex>

      <Text fontSize="12px" className="tbl-fees">
        {new Percent(data.stableLpFee * 1_000_000, 1_000_000).toSignificant()}%
      </Text>

      <Text fontSize="12px">{poolTokenPercentage?.toFixed(2)}%</Text>
    </TableRow>
  )

  if (link) {
    return <NextLink href={link}>{content}</NextLink>
  }

  return <>{content}</>
}
