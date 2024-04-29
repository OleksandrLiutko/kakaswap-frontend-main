import { useTranslation } from '@pancakeswap/localization'
import { Flex, NextLinkFromReactRouter, SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import Page from 'views/Page'
import EButtonSm from 'components/EButtonSm'
import EPageHeader from 'components/EPageHeader'
import InfoNav from './components/InfoNav'

export const InfoPageLayout = ({ children }) => {
  const router = useRouter()
  const chainName = useChainNameByQuery()
  const chainPath = useMultiChainPath()
  const { t } = useTranslation()
  const isStableSwap = router.query.type === 'stableSwap'

  return (
    <Page>
      <EPageHeader pageName="Analytics" />

      <Flex mt={16} flexWrap="wrap" style={{ gap: 12 }}>
        <NextLinkFromReactRouter to={`/info/v3${chainPath}`}>
          <EButtonSm style={{ minWidth: '100px' }}>V3</EButtonSm>
        </NextLinkFromReactRouter>

        <NextLinkFromReactRouter to={`/info${chainPath}`}>
          <EButtonSm style={{ minWidth: '100px' }} isActive={!isStableSwap}>
            V2
          </EButtonSm>
        </NextLinkFromReactRouter>

        <NextLinkFromReactRouter to={`/info?type=stableSwap`}>
          <EButtonSm style={{ minWidth: '100px' }} isActive={isStableSwap}>
            Stable Swap
          </EButtonSm>
        </NextLinkFromReactRouter>
      </Flex>

      {<InfoNav isStableSwap={isStableSwap} />}
      {children}
    </Page>
  )
}
