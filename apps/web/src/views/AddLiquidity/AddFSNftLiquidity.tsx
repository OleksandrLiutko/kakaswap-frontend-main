import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Currency, CurrencyAmount, Pair, Percent, Price, Token } from '@pancakeswap/sdk'
import { useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { DAY_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'

import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import { useLPApr } from 'state/swap/useLPApr'
import { isUserRejected, logError } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { Hash } from 'viem'
import { SendTransactionResult } from 'wagmi/actions'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { PairState } from 'hooks/usePairs'
import { Field } from 'state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers } from 'state/mint/hooks'

import { useTransactionAdder } from 'state/transactions/hooks'
import { useGasPrice, usePairAdder } from 'state/user/hooks'
import { calculateGasMargin } from 'utils'
import { calculateSlippageAmount } from 'utils/exchange'
import { getNftPoolAddress, useNftFactoryContract, usePositionHelperContract } from 'utils/flackUtils'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { SettingsMode } from 'components/EMenu/GlobalSettings/types'
import { POSITION_HELPER_ADDRESS } from 'config/constants/flack'
import { useAddLiquidityV2FormState } from 'state/mint/reducer'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'
import SettingsModal from '../../components/EMenu/GlobalSettings/SettingsModal'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import ConfirmAddFSNftLiquidityModal from './components/ConfirmAddFSNftLiquidityModal'

export interface FSNftLPChildrenProps {
  error: string
  currencies: {
    [Field.CURRENCY_A]?: Currency
    [Field.CURRENCY_B]?: Currency
  }
  isOneWeiAttack?: boolean
  noLiquidity: boolean
  handleCurrencyASelect: (currencyA_: Currency) => void
  formattedAmounts: {
    [Field.CURRENCY_A]?: string
    [Field.CURRENCY_B]?: string
  }
  onFieldAInput: (typedValue: string) => void
  maxAmounts: { [field in Field]?: CurrencyAmount<Token> }
  handleCurrencyBSelect: (currencyB_: Currency) => void
  onFieldBInput: (typedValue: string) => void
  pairState: PairState
  poolTokenPercentage: Percent
  price: Price<Currency, Currency>
  onPresentSettingsModal: () => void
  allowedSlippage: number
  pair: Pair
  poolData: {
    lpApr7d: number
  }
  shouldShowApprovalGroup: boolean
  showFieldAApproval: boolean
  approveACallback: () => Promise<SendTransactionResult>
  revokeACallback: () => Promise<SendTransactionResult>
  currentAllowanceA: CurrencyAmount<Currency> | undefined
  approvalA: ApprovalState
  showFieldBApproval: boolean
  approveBCallback: () => Promise<SendTransactionResult>
  revokeBCallback: () => Promise<SendTransactionResult>
  currentAllowanceB: CurrencyAmount<Currency> | undefined
  approvalB: ApprovalState
  onAdd: () => Promise<void>
  onCreateNftPool: () => Promise<void>
  onPresentAddLiquidityModal: () => void
  buttonDisabled: boolean
  errorText: string
  addIsWarning: boolean
  addIsUnsupported: boolean
  pendingText: string
  nftPool: string
  createNftDisabled: boolean
}

export default function AddFSNftLiquidity({
  currencyA,
  currencyB,
  children,
}: {
  currencyA: Currency
  currencyB: Currency
  children: (props: FSNftLPChildrenProps) => ReactElement
}) {
  const { account, chainId } = useAccountActiveChain()

  const addPair = usePairAdder()

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const gasPrice = useGasPrice()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useAddLiquidityV2FormState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts: mintParsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
    isOneWeiAttack,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const poolData = useLPApr(pair)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const [nftPool, setNftPool] = useState(undefined)
  const [createNftDisabled, setCreateNftDisabled] = useState(false)
  const [lockDuration, onInputLockDuration] = useState(0)

  // modal and loading
  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippage() // custom from users

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Token> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  const parsedAmounts = mintParsedAmounts

  // get formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [dependentField, independentField, noLiquidity, otherTypedValue, parsedAmounts, typedValue],
  )

  // check whether the user has approved the router on the tokens
  const {
    approvalState: approvalA,
    approveCallback: approveACallback,
    revokeCallback: revokeACallback,
    currentAllowance: currentAllowanceA,
  } = useApproveCallback(parsedAmounts[Field.CURRENCY_A], POSITION_HELPER_ADDRESS /* V2_ROUTER_ADDRESS[chainId] */)
  const {
    approvalState: approvalB,
    approveCallback: approveBCallback,
    revokeCallback: revokeBCallback,
    currentAllowance: currentAllowanceB,
  } = useApproveCallback(parsedAmounts[Field.CURRENCY_B], POSITION_HELPER_ADDRESS /* V2_ROUTER_ADDRESS[chainId] */)

  const addTransaction = useTransactionAdder()

  const positionHelper = usePositionHelperContract()
  const nftFactory = useNftFactoryContract()

  async function onAdd() {
    if (!chainId || !account || !positionHelper || !nftPool) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = mintParsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    // eslint-disable-next-line
    let estimate: any
    // eslint-disable-next-line
    let method: any
    // eslint-disable-next-line
    let args: Array<string | string[] | number | bigint>
    let value: bigint | null
    if (currencyA?.isNative || currencyB?.isNative) {
      const tokenBIsNative = currencyB?.isNative
      estimate = positionHelper.estimateGas.addLiquidityETHAndCreatePosition
      method = positionHelper.write.addLiquidityETHAndCreatePosition
      args = [
        (tokenBIsNative ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsNative ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        deadline,
        account,
        nftPool,
        lockDuration * DAY_IN_SECONDS,
      ]
      value = (tokenBIsNative ? parsedAmountB : parsedAmountA).quotient
    } else {
      estimate = positionHelper.estimateGas.addLiquidityAndCreatePosition
      method = positionHelper.write.addLiquidityAndCreatePosition
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        deadline,
        account,
        nftPool,
        lockDuration * DAY_IN_SECONDS,
      ]
      value = null
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    await estimate(
      args,
      value
        ? { value, account: positionHelper.account, chain: positionHelper.chain }
        : { account: positionHelper.account, chain: positionHelper.chain },
    )
      .then((estimatedGasLimit) =>
        method(args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then((response: Hash) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response })

          const symbolA = currencies[Field.CURRENCY_A]?.symbol
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
          const symbolB = currencies[Field.CURRENCY_B]?.symbol
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
          addTransaction(
            { hash: response },
            {
              summary: `Add ${amountA} ${symbolA} and ${amountB} ${symbolB}`,
              translatableSummary: {
                text: 'Add %amountA% %symbolA% and %amountB% %symbolB%',
                data: { amountA, symbolA, amountB, symbolB },
              },
              type: 'add-liquidity',
            },
          )

          if (pair) {
            addPair(pair)
          }
        }),
      )
      ?.catch((err) => {
        if (err && !isUserRejected(err)) {
          logError(err)
          console.error(`Add Liquidity failed`, err, args, value)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            err && !isUserRejected(err)
              ? t('Add liquidity failed: %message%', { message: transactionErrorToUserReadableMessage(err, t) })
              : undefined,
          txHash: undefined,
        })
      })
  }

  async function onCreateNftPool() {
    if (
      !chainId ||
      !account ||
      !nftFactory ||
      !currencies[Field.CURRENCY_A]?.wrapped ||
      !currencies[Field.CURRENCY_B]?.wrapped
    ) {
      console.error('cannot create nft pool')
      return
    }

    const estimate: any = nftFactory.estimateGas.createPool
    const method: any = nftFactory.write.createPool
    const args: [`0x${string}`] = [
      Pair.getAddress(currencies[Field.CURRENCY_A]?.wrapped, currencies[Field.CURRENCY_B]?.wrapped),
    ]

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    await estimate(args, { account: nftFactory.account, chain: nftFactory.chain })
      .then((estimatedGasLimit) => {
        method(args, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
          account: nftFactory.account,
          chain: nftFactory.chain,
        }).then((response: Hash) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response })

          const symbolA = currencies[Field.CURRENCY_A]?.symbol
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
          const symbolB = currencies[Field.CURRENCY_B]?.symbol
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)

          addTransaction(
            { hash: response },
            {
              summary: `Add ${amountA} ${symbolA} and ${amountB} ${symbolB} NFT Pool`,
              translatableSummary: {
                text: 'Add %amountA% %symbolA% and %amountB% %symbolB% NFT Pool',
                data: { amountA, symbolA, amountB, symbolB },
              },
              type: 'create-nft-pool',
            },
          )

          fetchNftPool()
        })
      })
      ?.catch((err) => {
        if (err && !isUserRejected(err)) {
          logError(err)
          console.error(`Create NFT Pool failed`, err, args)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            err && !isUserRejected(err)
              ? t('Create NFT Pool failed: %message%', { message: transactionErrorToUserReadableMessage(err, t) })
              : undefined,
          txHash: undefined,
        })
      })
  }

  const pendingText = t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: formatCurrencyAmount(parsedAmounts[Field.CURRENCY_A], 4, locale),
    symbolA: currencies[Field.CURRENCY_A]?.symbol ?? '',
    amountB: formatCurrencyAmount(parsedAmounts[Field.CURRENCY_B], 4, locale),
    symbolB: currencies[Field.CURRENCY_B]?.symbol ?? '',
  })

  const fetchNftPool = useCallback(() => {
    if (!chainId || !currencies[Field.CURRENCY_A]?.wrapped || !currencies[Field.CURRENCY_B]?.wrapped) {
      setNftPool(undefined)
      setCreateNftDisabled(true)
      return
    }

    getNftPoolAddress(
      chainId,
      Pair.getAddress(currencies[Field.CURRENCY_A]?.wrapped, currencies[Field.CURRENCY_B]?.wrapped),
    )
      .then((response) => {
        if (response !== '0x0000000000000000000000000000000000000000') setNftPool(response)
        else setNftPool(undefined)
      })
      .catch((_error) => {
        setNftPool(undefined)
      })
      .finally(() => {
        setCreateNftDisabled(false)
      })
  }, [chainId, currencies])

  useEffect(() => {
    if (!fetchNftPool || !chainId || !currencies) return
    fetchNftPool()
  }, [fetchNftPool, chainId, currencies])

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
  const addIsWarning = useIsTransactionWarning(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const [onPresentAddLiquidityModal_] = useModal(
    <ConfirmAddFSNftLiquidityModal
      title={noLiquidity ? t('You are creating a trading pair') : t('You will receive')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
      allowedSlippage={allowedSlippage}
      onAdd={onAdd}
      parsedAmounts={parsedAmounts}
      currencies={currencies}
      liquidityErrorMessage={liquidityErrorMessage}
      price={price}
      noLiquidity={noLiquidity}
      poolTokenPercentage={poolTokenPercentage}
      liquidityMinted={liquidityMinted}
      nftPool={nftPool}
      lockDuration={lockDuration}
      onInputLockDuration={onInputLockDuration}
    />,
    true,
    true,
    'addLiquidityModal',
  )

  const onPresentAddLiquidityModal = useCallback(() => {
    setLiquidityState({
      attemptingTxn: false,
      liquidityErrorMessage: undefined,
      txHash: undefined,
    })
    onPresentAddLiquidityModal_()
  }, [onPresentAddLiquidityModal_])

  const isValid = !error && !addError
  const errorText = error ?? addError

  const buttonDisabled = !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED

  const showFieldAApproval = approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING
  const showFieldBApproval = approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING

  const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval) && isValid

  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  return children({
    isOneWeiAttack,
    error,
    currencies,
    noLiquidity,
    handleCurrencyASelect,
    formattedAmounts,
    onFieldAInput,
    maxAmounts,
    handleCurrencyBSelect,
    onFieldBInput,
    pairState,
    poolTokenPercentage,
    price,
    onPresentSettingsModal,
    allowedSlippage,
    pair,
    poolData,
    shouldShowApprovalGroup,
    showFieldAApproval,
    approveACallback,
    approvalA,
    revokeACallback,
    currentAllowanceA,
    showFieldBApproval,
    approveBCallback,
    approvalB,
    revokeBCallback,
    currentAllowanceB,
    onAdd,
    onCreateNftPool,
    onPresentAddLiquidityModal,
    buttonDisabled,
    errorText,
    addIsWarning,
    addIsUnsupported,
    pendingText,
    nftPool,
    createNftDisabled,
  })
}
