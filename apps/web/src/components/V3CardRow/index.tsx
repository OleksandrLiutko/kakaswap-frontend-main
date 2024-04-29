import { Text, Card, Flex, Tag, SyncAltIcon, Grid, Box, AddIcon, MinusIcon } from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { styled } from 'styled-components'

import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { Percent, Currency, Pair, Price, Token, CurrencyAmount, Fraction } from '@pancakeswap/sdk'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { useTranslation } from '@pancakeswap/localization'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { PositionDetails } from '@pancakeswap/farms'
import { useToken } from 'hooks/Tokens'
import { unwrappedToken } from '@pancakeswap/tokens'
import { useMemo, useState } from 'react'
import { usePool } from 'hooks/v3/usePools'
import { Position } from '@pancakeswap/v3-sdk'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import getPriceOrderingFromPositionForUI from 'hooks/v3/utils/getPriceOrderingFromPositionForUI'
import { useV3PositionFees } from 'hooks/v3/useV3PositionFees'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import isPoolTickInRange from 'utils/isPoolTickInRange'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { Bound } from 'config/constants/types'

const TableRow = styled(Grid)`
  grid-template-columns: 2fr 1fr 1.4fr 1fr 1fr;
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
    .tbl-range {
      display: none;
    }
  }

  @media screen and (max-width: 680px) {
    grid-template-columns: 2fr 1fr 1fr;
    .tbl-range,
    .tbl-fees {
      display: none;
    }
  }
`

const useInverter = ({
  priceLower,
  priceUpper,
  quote,
  base,
  invert,
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
  invert?: boolean
}): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} => {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  }
}

interface V3CardRowProps {
  link?: string
  positionDetails: PositionDetails
  onSwitch?: () => void
}

export const V3CardRow = ({ link, positionDetails, onSwitch }: V3CardRowProps) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { account, chainId } = useAccountActiveChain()
  const [receiveWNATIVE, setReceiveWNATIVE] = useState(false)

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId,
  } = positionDetails

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  const [poolState, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const position = useMemo(() => {
    if (pool && typeof liquidity === 'bigint' && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position)

  const [manuallyInverted, setManuallyInverted] = useState(false)

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  })

  const inverted = token1 && base ? base.equals(token1) : undefined
  const currencyQuote = inverted ? currency0 : currency1
  const currencyBase = inverted ? currency1 : currency0

  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, positionDetails?.tokenId, receiveWNATIVE)

  const price0 = useStablecoinPrice(token0 ?? undefined, { enabled: !!feeValue0 })
  const price1 = useStablecoinPrice(token1 ?? undefined, { enabled: !!feeValue1 })

  const fiatValueOfLiquidity: CurrencyAmount<Currency> | null = useMemo(() => {
    if (!price0 || !price1 || !position) return null
    const amount0 = price0.quote(position.amount0)
    const amount1 = price1.quote(position.amount1)

    return amount0.add(amount1)
  }, [price0, price1, position])

  const inRange = isPoolTickInRange(pool, tickLower, tickUpper)

  const feePercentage = Number(new Percent(feeAmount || 0, 1_000_000).toSignificant())

  const positionSummaryLink = `/liquidity/${tokenId}`

  const content = (
    <TableRow>
      <Flex pr="8px">
        <DoubleCurrencyLogo currency0={currencyQuote} currency1={currencyBase} size={32} />
        <Flex flexDirection="column" ml="8px">
          <Flex alignItems="center">
            <Text fontSize="14px">
              {currencyQuote?.symbol}-{currencyBase?.symbol}
            </Text>
            <Text ml="4px" fontSize="12px">
              V3
            </Text>
          </Flex>
          <Text fontSize="10px">{inRange ? 'in range' : 'out range'}</Text>
        </Flex>
      </Flex>

      <Flex flexDirection="column" className="tbl-amount">
        <Text fontSize="12px">
          $
          {fiatValueOfLiquidity?.greaterThan(new Fraction(1, 100))
            ? fiatValueOfLiquidity.toFixed(2, { groupSeparator: ',' })
            : '-'}
        </Text>
      </Flex>

      <Flex flexDirection="column" className="tbl-range">
        <Flex alignItems="center">
          <Text fontSize="10px" color="gray" mr="2px">
            MIN:{' '}
          </Text>
          <Text fontSize="12px">
            {' '}
            {formatTickPrice(priceLower, tickAtLimit, Bound.LOWER, locale)} {currencyQuote?.symbol}/
            {currencyBase?.symbol}
          </Text>
        </Flex>
        <Flex alignItems="center">
          <Text fontSize="10px" color="gray" mr="2px">
            MAX:{' '}
          </Text>
          <Text fontSize="12px">
            {' '}
            {formatTickPrice(priceUpper, tickAtLimit, Bound.UPPER, locale)} {currencyQuote?.symbol}/
            {currencyBase?.symbol}
          </Text>
        </Flex>
      </Flex>

      <Flex flexDirection="column" className="tbl-composition">
        <Flex>
          <CurrencyLogo currency={currencyQuote} size="16px" />
          <Text fontSize="12px" ml="4px">
            {formatCurrencyAmount(position?.amount0, 4, locale)}
          </Text>
        </Flex>
        <Flex>
          <CurrencyLogo currency={currencyBase} size="16px" />
          <Text fontSize="12px" ml="4px">
            {formatCurrencyAmount(position?.amount1, 4, locale)}
          </Text>
        </Flex>
      </Flex>

      <Text fontSize="12px" className="tbl-range">
        {feePercentage?.toFixed(2)}%
      </Text>
    </TableRow>
  )

  return <NextLink href={positionSummaryLink}>{content}</NextLink>
}
