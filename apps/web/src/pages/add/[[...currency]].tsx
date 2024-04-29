import { isStableFarm } from '@pancakeswap/farms'
import { useCurrency } from 'hooks/Tokens'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CHAIN_IDS } from 'utils/wagmi'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useCurrencyParams } from 'views/AddLiquidityV3/hooks/useCurrencyParams'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import AddLiquidityV2FormProvider from 'views/AddLiquidity/AddLiquidityV2FormProvider'
import Page from 'components/Layout/Page'
import { Flex } from '@pancakeswap/uikit'
import EButtonSm from 'components/EButtonSm'
import EPageHeader from 'components/EPageHeader'
import useStableConfig from 'views/Swap/hooks/useStableConfig'
import { Currency } from '@pancakeswap/swap-sdk-core'
import currencyId from 'utils/currencyId'
import { safeGetAddress } from 'utils'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { NATIVE, WNATIVE } from '@pancakeswap/sdk'
import { useStableSwapPairs } from 'state/swap/useStableSwapPairs'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()

  const { currencyIdA, currencyIdB, feeAmount } = useCurrencyParams()
  const baseCurrency = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const stablePairs = useStableSwapPairs()
  const stableConfig = useStableConfig({
    tokenA: baseCurrency,
    tokenB: currencyB,
  })

  const [selectorType, setSelectorType] = useState(SELECTOR_TYPE.FSNFT)

  const isStable = router.query.stable
  const isV2 = router.query.v2

  useEffect(() => {
    if (isStable) setSelectorType(SELECTOR_TYPE.STABLE)
    if (isV2) setSelectorType(SELECTOR_TYPE.V2)
  }, [isStable, isV2])

  useEffect(() => {
    if (!currencyIdA || !currencyIdB) return

    if (stableConfig.stableSwapConfig) {
      handleStable()
    } else if (selectorType === SELECTOR_TYPE.STABLE) {
      handleSelector(SELECTOR_TYPE.V2)
    }
  }, [currencyIdA, currencyIdB, stableConfig.stableSwapConfig])

  const handleRefresh = useCallback(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          currency: [currencyIdA, currencyIdB],
        },
      },
      undefined,
      { shallow: true },
    )
  }, [router, currencyIdA, currencyIdB])

  const handleStable = useCallback(() => {
    if (!stableConfig.stableSwapConfig) {
      if (stablePairs && stablePairs.length > 0) {
        const idA = currencyId(stablePairs[0].token0)
        const idB = currencyId(stablePairs[0].token1)
        if (!idA || !idB) return
        setSelectorType(SELECTOR_TYPE.STABLE)
        router.replace(
          {
            pathname: router.pathname,
            query: {
              currency: [idA, idB],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    }
  }, [router, stableConfig, setSelectorType])

  const handleSelector = useCallback(
    (_selectorType) => {
      if (stableConfig.stableSwapConfig && chainId) {
        const idA = NATIVE[chainId]
        console.log(idA)
        router.replace(
          {
            pathname: router.pathname,
            query: {
              currency: [idA.symbol, currencyB?.symbol],
            },
          },
          undefined,
          { shallow: true },
        )
      }
      setSelectorType(_selectorType)
    },
    [router, stableConfig, chainId, setSelectorType],
  )

  return (
    <Page>
      <Flex flexDirection="column" maxWidth={1024} width="100%" height="100%" position="relative" alignItems="center">
        <EPageHeader pageName="Liquidity" />

        <Flex mt={16} flexWrap="wrap" style={{ gap: 12 }}>
          <EButtonSm
            style={{ minWidth: '100px' }}
            isActive={selectorType === SELECTOR_TYPE.FSNFT}
            onClick={() => handleSelector(SELECTOR_TYPE.FSNFT)}
          >
            fsNFT
          </EButtonSm>
          <EButtonSm
            style={{ minWidth: '100px' }}
            isActive={selectorType === SELECTOR_TYPE.V2}
            onClick={() => handleSelector(SELECTOR_TYPE.V2)}
          >
            V2
          </EButtonSm>
          <EButtonSm
            style={{ minWidth: '100px' }}
            isActive={selectorType === SELECTOR_TYPE.V3}
            onClick={() => handleSelector(SELECTOR_TYPE.V3)}
          >
            V3
          </EButtonSm>
          <EButtonSm
            style={{ minWidth: '100px' }}
            isActive={selectorType === SELECTOR_TYPE.STABLE}
            onClick={() => {
              handleStable()
            }}
          >
            Stable
          </EButtonSm>
        </Flex>

        <AddLiquidityV2FormProvider>
          <LiquidityFormProvider>
            <AddLiquidityV3Layout handleRefresh={handleRefresh} selectorType={selectorType}>
              <UniversalAddLiquidity selectorType={selectorType} currencyIdA={currencyIdA} currencyIdB={currencyIdB} />
              <V3SubgraphHealthIndicator />
            </AddLiquidityV3Layout>
          </LiquidityFormProvider>
        </AddLiquidityV2FormProvider>
      </Flex>
    </Page>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage
