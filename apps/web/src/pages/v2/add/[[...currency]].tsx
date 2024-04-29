import { CAKE, USDC } from '@pancakeswap/tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { CHAIN_IDS } from 'utils/wagmi'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import { useActiveChainId } from 'hooks/useActiveChainId'
import AddLiquidityV2FormProvider from 'views/AddLiquidity/AddLiquidityV2FormProvider'
import Page from 'components/Layout/Page'
import { Flex } from '@pancakeswap/uikit'
import ECircleButton from 'components/ECircleButton'
import { useCallback } from 'react'
import { SELECTOR_TYPE } from 'views/AddLiquidityV3/types'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    CAKE[chainId]?.address ?? USDC[chainId]?.address,
  ]

  const handleSelectV3 = useCallback(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: router.query,
      },
      `/add/${currencyIdA}/${currencyIdB}`,
      { shallow: true },
    )
  }, [currencyIdA, currencyIdB, router])

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

  return (
    <Page>
      <Flex flexDirection="column" maxWidth={1024} width="100%" height="100%" position="relative" alignItems="center">
        <AddLiquidityV2FormProvider>
          <AddLiquidityV3Layout selectorType={SELECTOR_TYPE.V2}>
            <UniversalAddLiquidity
              selectorType={SELECTOR_TYPE.V2}
              isV2
              currencyIdA={currencyIdA}
              currencyIdB={currencyIdB}
            />
          </AddLiquidityV3Layout>
        </AddLiquidityV2FormProvider>
      </Flex>
    </Page>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|BNB)-(0x[a-fA-F0-9]{40}|BNB)$/

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { currency: [] } }],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { currency = [] } = params
  const [currencyIdA, currencyIdB] = currency
  const match = currencyIdA?.match(OLD_PATH_STRUCTURE)

  if (match?.length) {
    return {
      redirect: {
        statusCode: 301,
        destination: `/add/${match[1]}/${match[2]}`,
      },
    }
  }

  if (currencyIdA && currencyIdB && currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return {
      redirect: {
        statusCode: 303,
        destination: `/add/${currencyIdA}`,
      },
    }
  }

  return {
    props: {},
  }
}
