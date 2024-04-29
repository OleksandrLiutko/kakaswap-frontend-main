import React, { useCallback } from 'react'
import { Currency, CurrencyAmount, Fraction, Percent, Token } from '@pancakeswap/sdk'
import {
  InjectedModalProps,
  Button,
  Flex,
  Input,
  Text,
  AutoColumn,
  AutoRow,
  MinusIcon,
  AddIcon,
  IconButton,
  Box,
} from '@pancakeswap/uikit'
import { TransactionErrorContent, ConfirmationModalContent, NumericalInput } from '@pancakeswap/widgets-internal'
import { useTranslation } from '@pancakeswap/localization'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { Field } from 'state/burn/actions'
import _toNumber from 'lodash/toNumber'
import EInputDay from 'components/EInputDay'
import { AddLiquidityModalHeader, PairDistribution } from './common'

interface ConfirmAddFSNftLiquidityModalProps {
  title: string
  customOnDismiss: () => void
  attemptingTxn: boolean
  hash: string
  pendingText: string
  currencies: { [field in Field]?: Currency }
  noLiquidity: boolean
  allowedSlippage: number
  liquidityErrorMessage: string
  price: Fraction
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  onAdd: () => void
  poolTokenPercentage: Percent
  liquidityMinted: CurrencyAmount<Token>
  currencyToAdd: Token
  isStable?: boolean
  nftPool: string
  lockDuration: number
  onInputLockDuration: (newValue: number) => void
}

const ConfirmAddFSNftLiquidityModal: React.FC<
  React.PropsWithChildren<InjectedModalProps & ConfirmAddFSNftLiquidityModalProps>
> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  price,
  currencies,
  noLiquidity,
  allowedSlippage,
  parsedAmounts,
  liquidityErrorMessage,
  onAdd,
  poolTokenPercentage,
  liquidityMinted,
  currencyToAdd,
  isStable,
  nftPool,
  lockDuration,
  onInputLockDuration,
}) => {
  const { t } = useTranslation()

  let percent = 0.5

  // Calculate distribution percentage for display
  if ((isStable && parsedAmounts[Field.CURRENCY_A]) || parsedAmounts[Field.CURRENCY_B]) {
    const amountCurrencyA = parsedAmounts[Field.CURRENCY_A]
      ? _toNumber(parsedAmounts[Field.CURRENCY_A]?.toSignificant(6))
      : 0
    // If there is no price fallback to compare only amounts
    const currencyAToCurrencyB = parseFloat(price?.toSignificant(4)) || 1
    const normalizedAmountCurrencyA = currencyAToCurrencyB * amountCurrencyA
    const amountCurrencyB = parsedAmounts[Field.CURRENCY_B]
      ? _toNumber(parsedAmounts[Field.CURRENCY_B]?.toSignificant(6))
      : 0

    percent = normalizedAmountCurrencyA / (normalizedAmountCurrencyA + amountCurrencyB)
  }

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const modalHeader = useCallback(() => {
    return (
      <AddLiquidityModalHeader
        allowedSlippage={allowedSlippage}
        currencies={currencies}
        liquidityMinted={liquidityMinted}
        poolTokenPercentage={poolTokenPercentage}
        price={price}
        noLiquidity={noLiquidity}
      >
        <PairDistribution
          title={t('Input')}
          percent={percent}
          currencyA={currencies[Field.CURRENCY_A]}
          currencyAValue={parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          currencyB={currencies[Field.CURRENCY_B]}
          currencyBValue={parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
        />
      </AddLiquidityModalHeader>
    )
  }, [allowedSlippage, percent, currencies, liquidityMinted, noLiquidity, parsedAmounts, poolTokenPercentage, price, t])

  const modalBottom = useCallback(() => {
    return (
      <>
        <AutoRow gap="20px" width="100%" mt="20px">
          <Flex flexDirection="column" flexGrow={1}>
            <Text fontSize="18px">Lock Duration</Text>
            <Box color="gray" onClick={() => onInputLockDuration(180)} style={{ cursor: 'pointer' }}>
              set max bonus
            </Box>
          </Flex>
          <EInputDay inputValue={lockDuration} setInputValue={onInputLockDuration} />
        </AutoRow>
        <Button width="100%" onClick={onAdd} mt="20px">
          {noLiquidity ? t('Create Pair & Supply') : t('Confirm Supply')}
        </Button>
      </>
    )
  }, [noLiquidity, lockDuration, onInputLockDuration, onAdd, t])

  const confirmationContent = useCallback(
    () =>
      liquidityErrorMessage ? (
        <TransactionErrorContent onDismiss={handleDismiss} message={liquidityErrorMessage} />
      ) : (
        <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
      ),
    [liquidityErrorMessage, handleDismiss, modalHeader, modalBottom],
  )

  return (
    <TransactionConfirmationModal
      minWidth={['100%', , '420px']}
      maxWidth="500px"
      title={title}
      onDismiss={onDismiss}
      customOnDismiss={customOnDismiss}
      attemptingTxn={attemptingTxn}
      currencyToAdd={currencyToAdd}
      hash={hash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  )
}

export default ConfirmAddFSNftLiquidityModal
