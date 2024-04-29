import { Flex } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { CHAIN_IDS } from 'utils/wagmi'
import Page from 'views/Page'
import useStableConfig, { LPStablePair, StableConfigContext } from 'views/Swap/hooks/useStableConfig'
import { useCallback } from 'react'
import { StablePairCard } from 'views/AddLiquidityV3/components/StablePairCard'
import { V3SubgraphHealthIndicator } from 'components/SubgraphHealthIndicator'
import AddLiquidityV2FormProvider from 'views/AddLiquidity/AddLiquidityV2FormProvider'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useCurrencyParams } from 'views/AddLiquidityV3/hooks/useCurrencyParams'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'
import EPageHeader from 'components/EPageHeader'

export const StableContextProvider = (props: { pair: LPStablePair; account: string | undefined }) => {
  const stableConfig = useStableConfig({
    tokenA: props.pair?.token0,
    tokenB: props.pair?.token1,
  })

  if (!stableConfig.stableSwapConfig) return null

  return (
    <StableConfigContext.Provider value={stableConfig}>
      <StablePairCard {...props} />
    </StableConfigContext.Provider>
  )
}

export default function PoolListPage() {
  const router = useRouter()

  const { currencyIdA, currencyIdB } = useCurrencyParams()

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

  return (
    <Page>
      <Flex flexDirection="column" maxWidth={1024} width="100%" height="100%" position="relative" alignItems="center">
        <AddLiquidityV2FormProvider>
          <LiquidityFormProvider>
            <AddLiquidityV3Layout selectorType={SELECTOR_TYPE.V3} handleRefresh={handleRefresh}>
              <UniversalAddLiquidity
                selectorType={SELECTOR_TYPE.V3}
                currencyIdA={currencyIdA}
                currencyIdB={currencyIdB}
              />
              <V3SubgraphHealthIndicator />
            </AddLiquidityV3Layout>
          </LiquidityFormProvider>
        </AddLiquidityV2FormProvider>
      </Flex>
    </Page>
  )
}

PoolListPage.chains = CHAIN_IDS
