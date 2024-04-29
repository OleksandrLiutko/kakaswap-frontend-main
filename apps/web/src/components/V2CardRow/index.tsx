import { Text, Card, Flex, Tag, SyncAltIcon, Grid, Box, AddIcon, MinusIcon } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { styled } from 'styled-components'

import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { Percent, Currency, Pair } from '@pancakeswap/sdk'
import { useAccount } from 'wagmi'
import { useTokenBalance } from 'state/wallet/hooks'
import { usePoolTokenPercentage, useTokensDeposited, useTotalUSDValue } from 'components/PositionCard'
import useTotalSupply from 'hooks/useTotalSupply'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { useTranslation } from '@pancakeswap/localization'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'

const TableRow = styled(Grid)`
  grid-template-columns: 2.4fr 1fr 1fr 1fr;
  cursor: pointer;
  padding: 4px;
  transition: background 0.3s;
  align-items: center;
  border-radius: 4px;

  &:hover {
    background: #33333333;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr;
    .tbl-amount {
      display: none;
    }
  }
`

interface V2CardRowProps {
  link?: string
  pair: Pair
  onSwitch?: () => void
}

export const V2CardRow = ({ link, pair, onSwitch }: V2CardRowProps) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { address: account } = useAccount()
  const userPoolBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  const totalPoolTokens = useTotalSupply(pair?.liquidityToken)

  const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

  const [token0Deposited, token1Deposited] = useTokensDeposited({ pair, userPoolBalance, totalPoolTokens })

  const totalUSDValue = useTotalUSDValue({
    currency0: pair?.token0,
    currency1: pair?.token1,
    token0Deposited,
    token1Deposited,
  })

  const content = (
    <TableRow>
      <Flex pr="8px">
        <DoubleCurrencyLogo currency0={pair?.token0} currency1={pair?.token1} size={32} />
        <Flex alignItems="center">
          <Text ml="8px" fontSize="14px">
            {pair?.token0.symbol}-{pair?.token1.symbol}
          </Text>
          <Text ml="4px" fontSize="12px">
            V2
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

      <Flex flexDirection="column" className="tbl-composition">
        <Flex>
          <CurrencyLogo currency={pair?.token0} size="16px" />
          <Text fontSize="12px" ml="4px">
            {formatCurrencyAmount(token0Deposited, 4, locale)}
          </Text>
        </Flex>
        <Flex>
          <CurrencyLogo currency={pair?.token1} size="16px" />
          <Text fontSize="12px" ml="4px">
            {formatCurrencyAmount(token1Deposited, 4, locale)}
          </Text>
        </Flex>
      </Flex>

      <Text fontSize="12px">{poolTokenPercentage?.toFixed(2)}%</Text>
    </TableRow>
  )

  if (link) {
    return <NextLink href={link}>{content}</NextLink>
  }

  return <>{content}</>
}
