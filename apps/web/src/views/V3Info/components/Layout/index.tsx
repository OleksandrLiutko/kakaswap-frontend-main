import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, NextLinkFromReactRouter, SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import Page from 'views/Page'
import EButtonSm from 'components/EButtonSm'
import EPageHeader from 'components/EPageHeader'
import InfoNav from './InfoNav'
import { v3InfoPath } from '../../constants'

export const InfoPageLayout = ({ children }) => {
  const router = useRouter()
  const chainName = useChainNameByQuery()
  const chainPath = useMultiChainPath()
  const isV3 = router?.pathname?.includes(v3InfoPath)
  const { t } = useTranslation()

  return (
    <Page>
      <EPageHeader pageName="Analytics" />

      <Flex mt={16} flexWrap="wrap" style={{ gap: 12 }}>
        <NextLinkFromReactRouter to={`/info/v3${chainPath}`}>
          <EButtonSm style={{ minWidth: '100px' }} isActive>
            V3
          </EButtonSm>
        </NextLinkFromReactRouter>

        <NextLinkFromReactRouter to={`/info${chainPath}`}>
          <EButtonSm style={{ minWidth: '100px' }}>V2</EButtonSm>
        </NextLinkFromReactRouter>

        <NextLinkFromReactRouter to={`/info?type=stableSwap`}>
          <EButtonSm style={{ minWidth: '100px' }}>Stable Swap</EButtonSm>
        </NextLinkFromReactRouter>
      </Flex>

      <InfoNav isStableSwap={false} />
      {children}
    </Page>
  )
}
