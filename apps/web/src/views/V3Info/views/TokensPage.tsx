import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Card, Heading, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTokenDatasSWR } from 'state/info/hooks'
import EBox from 'components/EBox'
import { useWatchlistTokens } from 'state/user/hooks'
import { useTopTokensData } from 'views/V3Info/hooks'
import TokenTable from '../components/TokenTable'
import TopTokenMovers from '../components/TopTokenMovers'

const TokensOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  const allTokens = useTopTokensData()

  const formattedTokens = useMemo(() => {
    if (allTokens)
      return Object.values(allTokens)
        .map((token) => token)
        .filter((token) => token)
    return []
  }, [allTokens])

  /* const [savedTokens] = useWatchlistTokens()
  const watchListTokens = useTokenDatasSWR(savedTokens) */

  return (
    <Page>
      <Heading scale="lg" mb="16px" id="info-tokens-title">
        {t('All Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />
    </Page>
  )
}

export default TokensOverview
