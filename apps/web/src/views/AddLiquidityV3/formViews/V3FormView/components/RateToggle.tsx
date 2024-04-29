import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Button, Flex, SyncAltIcon, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const RateToggleButton = styled(Button)`
  border-radius: 4px;
  padding-left: 4px;
  padding-right: 4px;
  color: white;
`

export default function RateToggle({
  currencyA,
  handleRateToggle,
}: {
  currencyA: Currency
  handleRateToggle: () => void
}) {
  const { t } = useTranslation()

  return currencyA ? (
    <Flex justifyContent="center" alignItems="center">
      <Text mr="4px" color="textSubtle" fontSize="12px">
        {t('VIEW PRICES IN')}
      </Text>
      <RateToggleButton variant="secondary" scale="sm" onClick={handleRateToggle} startIcon={<SyncAltIcon />}>
        {currencyA?.symbol}
      </RateToggleButton>
    </Flex>
  ) : null
}
