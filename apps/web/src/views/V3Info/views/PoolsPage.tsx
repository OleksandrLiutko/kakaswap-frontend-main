import { useTranslation } from '@pancakeswap/localization'
import { Card, Heading, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useWatchlistPools } from 'state/user/hooks'
import { usePoolDatasSWR } from 'state/info/hooks'
import Page from 'components/Layout/Page'
import EBox from 'components/EBox'
import PoolTable from '../components/PoolTable'

import { useTopPoolsData } from '../hooks'

const PoolsOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const topPoolsData = useTopPoolsData()

  const poolsData = useMemo(() => {
    if (topPoolsData) {
      return Object.values(topPoolsData)
    }
    return []
  }, [topPoolsData])

  return (
    <Page>
      <Heading scale="lg" mb="16px" id="info-pools-title">
        {t('All Pairs')}
      </Heading>
      <PoolTable poolDatas={poolsData} />
    </Page>
  )
}

export default PoolsOverview
