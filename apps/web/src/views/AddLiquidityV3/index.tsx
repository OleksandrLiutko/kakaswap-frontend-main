import { CurrencySelect } from 'components/CurrencySelect'
import { CommonBasesType } from 'components/SearchModal/types'

import { Currency, NATIVE, WNATIVE } from '@pancakeswap/sdk'
import {
  FlexGap,
  AutoColumn,
  CardBody,
  Card,
  AddIcon,
  PreTitle,
  DynamicSection,
  RefreshIcon,
  IconButton,
  Box,
} from '@pancakeswap/uikit'

import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useCallback, useEffect, useMemo } from 'react'

import currencyId from 'utils/currencyId'
import { useRouter } from 'next/router'
import { Trans, useTranslation } from '@pancakeswap/localization'

import Page from 'views/Page'
import { AppHeader } from 'components/App'
import EBox from 'components/EBox'
import { styled } from 'styled-components'
import { atom } from 'jotai'

import { useCurrency } from 'hooks/Tokens'
import useStableConfig, { StableConfigContext } from 'views/Swap/hooks/useStableConfig'
import AddStableLiquidity from 'views/AddLiquidity/AddStableLiquidity'
import AddFSNftLiquidity from 'views/AddLiquidity/AddFSNftLiquidity'
import AddLiquidity from 'views/AddLiquidity'
import noop from 'lodash/noop'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAddLiquidityV2FormDispatch } from 'state/mint/reducer'
import { resetMintState } from 'state/mint/actions'
import { safeGetAddress } from 'utils'
import FeeSelector from './formViews/V3FormView/components/FeeSelector'
import V3FormView from './formViews/V3FormView'
import { HandleFeePoolSelectFn, SELECTOR_TYPE } from './types'
import StableFormView from './formViews/StableFormView'
import V2FormView from './formViews/V2FormView'
import { useCurrencyParams } from './hooks/useCurrencyParams'
import FSNftFormView from './formViews/FSNftFormView'

export const BodyWrapper = styled(EBox)`
  max-width: 858px;
  width: 100%;
  z-index: 1;
  margin-bottom: 24px;
`

/* two-column layout where DepositAmount is moved at the very end on mobile. */
export const ResponsiveTwoColumns = styled.div`
  display: grid;
  grid-column-gap: 32px;
  grid-row-gap: 16px;
  grid-template-columns: 1fr;

  grid-template-rows: max-content;
  grid-auto-flow: row;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 1fr;
  }
`

const selectTypeAtom = atom(SELECTOR_TYPE.V3)

interface UniversalAddLiquidityPropsType {
  currencyIdA: string
  currencyIdB: string
  isV2?: boolean
  preferredSelectType?: SELECTOR_TYPE
  preferredFeeAmount?: FeeAmount
  selectorType: SELECTOR_TYPE
}

export function UniversalAddLiquidity({
  isV2,
  currencyIdA,
  currencyIdB,
  preferredSelectType,
  preferredFeeAmount,
  selectorType,
}: UniversalAddLiquidityPropsType) {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()

  const dispatch = useAddLiquidityV2FormDispatch()

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  const router = useRouter()
  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const stableConfig = useStableConfig({
    tokenA: baseCurrency,
    tokenB: currencyB,
  })

  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  const [, , feeAmountFromUrl] = router.query.currency || []

  // fee selection from url
  const feeAmount: FeeAmount | undefined = useMemo(() => {
    return (
      preferredFeeAmount ||
      (feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
        ? parseFloat(feeAmountFromUrl)
        : undefined)
    )
  }, [preferredFeeAmount, feeAmountFromUrl])

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      }
      // prevent wnative + native
      const isNATIVEOrWNATIVENew =
        currencyNew?.isNative || (chainId !== undefined && currencyIdNew === WNATIVE[chainId]?.address)
      const isNATIVEOrWNATIVEOther =
        currencyIdOther !== undefined &&
        (currencyIdOther === NATIVE[chainId]?.symbol ||
          (chainId !== undefined && safeGetAddress(currencyIdOther) === WNATIVE[chainId]?.address))

      if (isNATIVEOrWNATIVENew && isNATIVEOrWNATIVEOther) {
        return [currencyIdNew, undefined]
      }

      return [currencyIdNew, currencyIdOther]
    },
    [chainId],
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idA],
            },
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idA, idB],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [handleCurrencySelect, currencyIdB, router],
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idB],
            },
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idA, idB],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [handleCurrencySelect, currencyIdA, router],
  )

  const handleFeePoolSelect = useCallback<HandleFeePoolSelectFn>(
    ({ type, feeAmount: newFeeAmount }) => {
      if (newFeeAmount) {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [currencyIdA, currencyIdB, newFeeAmount.toString()],
            },
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: router.pathname.replace('/v2', ''),
            query: {
              ...router.query,
              currency: [currencyIdA, currencyIdB],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [currencyIdA, currencyIdB, router],
  )

  const handleSelectV2 = useCallback(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: router.query,
      },
      `/v2/add/${currencyIdA}/${currencyIdB}`,
      { shallow: true },
    )
  }, [currencyIdA, currencyIdB, router])

  useEffect(() => {
    if (preferredFeeAmount && !feeAmountFromUrl && selectorType === SELECTOR_TYPE.V3) {
      handleFeePoolSelect({ type: selectorType, feeAmount: preferredFeeAmount })
    }
  }, [preferredFeeAmount, feeAmountFromUrl, handleFeePoolSelect, selectorType])

  return (
    <Box mt="8px">
      <ResponsiveTwoColumns>
        <AutoColumn alignSelf="start" mt="8px">
          <PreTitle mb="8px">{t('Choose Token Pair')}</PreTitle>
          <FlexGap gap="8px" width="100%" mb="8px" alignItems="center" flexWrap="wrap">
            <CurrencySelect
              id="add-liquidity-select-tokena"
              selectedCurrency={baseCurrency}
              onCurrencySelect={handleCurrencyASelect}
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
              hideBalance
            />
            <CurrencySelect
              id="add-liquidity-select-tokenb"
              selectedCurrency={quoteCurrency}
              onCurrencySelect={handleCurrencyBSelect}
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
              hideBalance
            />
          </FlexGap>
          {selectorType === SELECTOR_TYPE.V3 && (
            <EBox disabled={!baseCurrency || !currencyB} style={{ padding: 12 }}>
              <FeeSelector
                currencyA={baseCurrency ?? undefined}
                currencyB={quoteCurrency ?? undefined}
                handleFeePoolSelect={handleFeePoolSelect}
                feeAmount={feeAmount}
                handleSelectV2={handleSelectV2}
              />
            </EBox>
          )}
        </AutoColumn>
        {selectorType === SELECTOR_TYPE.STABLE && (
          <StableConfigContext.Provider value={stableConfig}>
            <AddStableLiquidity currencyA={baseCurrency} currencyB={quoteCurrency}>
              {(props) => <StableFormView {...props} stableLpFee={stableConfig?.stableSwapConfig?.stableLpFee} />}
            </AddStableLiquidity>
          </StableConfigContext.Provider>
        )}
        {selectorType === SELECTOR_TYPE.V3 && (
          <V3FormView
            feeAmount={feeAmount}
            baseCurrency={baseCurrency}
            quoteCurrency={quoteCurrency}
            currencyIdA={currencyIdA}
            currencyIdB={currencyIdB}
          />
        )}
        {selectorType === SELECTOR_TYPE.V2 && (
          <AddLiquidity currencyA={baseCurrency} currencyB={quoteCurrency}>
            {(props) => <V2FormView {...props} />}
          </AddLiquidity>
        )}
        {selectorType === SELECTOR_TYPE.FSNFT && (
          <AddFSNftLiquidity currencyA={baseCurrency} currencyB={quoteCurrency}>
            {(props) => <FSNftFormView {...props} />}
          </AddFSNftLiquidity>
        )}
      </ResponsiveTwoColumns>
    </Box>
  )
}

const SELECTOR_TYPE_T = {
  [SELECTOR_TYPE.STABLE]: <Trans>Add Stable Liquidity</Trans>,
  [SELECTOR_TYPE.V2]: <Trans>Add V2 Liquidity</Trans>,
  [SELECTOR_TYPE.V3]: <Trans>Add V3 Liquidity</Trans>,
  [SELECTOR_TYPE.FSNFT]: <Trans>Add fsNFT Liquidity</Trans>,
} as const satisfies Record<SELECTOR_TYPE, JSX.Element>

export function AddLiquidityV3Layout({
  showRefreshButton = false,
  handleRefresh,
  selectorType,
  children,
}: {
  showRefreshButton?: boolean
  handleRefresh?: () => void
  selectorType: SELECTOR_TYPE
  children: React.ReactNode
}) {
  const { t } = useTranslation()

  const { currencyIdA, currencyIdB, feeAmount } = useCurrencyParams()

  const baseCurrency = useCurrency(currencyIdA)
  const quoteCurrency = useCurrency(currencyIdB)

  const title = SELECTOR_TYPE_T[selectorType] || t('Add Liquidity')

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          title={title}
          IconSlot={
            <>
              {showRefreshButton && (
                <IconButton variant="text" scale="sm">
                  <RefreshIcon onClick={handleRefresh || noop} color="textSubtle" height={24} width={24} />
                </IconButton>
              )}
            </>
          }
        />
        {children}
      </BodyWrapper>
    </Page>
  )
}
