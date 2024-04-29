import { styled } from 'styled-components'
import { Flex, Grid } from '@pancakeswap/uikit'
import Page from 'views/Page'

import { WETH9 } from '@pancakeswap/sdk'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { FLACK_ADDRESS } from 'config/constants/flack'
import { useLpPrice } from 'hooks/useLpPirce'
import { displayNumber } from 'utils/flackHelper'
import { useActiveChainId } from 'hooks/useActiveChainId'
import EPageHeader from 'components/EPageHeader'
import EpochCard from './components/EpochCard'
import PendingCard from './components/PendingCard'
import AllocateCard from './components/AllocateCard'
import { useUserAllocationData } from './hooks/useUserAllocationData'
import { useDashboardData } from './hooks/useDashboardData'
import { useDistributionData } from './hooks/useDistributionData'
import { usePendingRewardData } from './hooks/usePendingRewardData'
import { distributedTokenInfo } from './config'

const Instruction = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #477968;
  margin-top: 24px;
`

const RewardCard = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  text-align: center;
  gap: 2px;
`

const RewardLabel = styled.label`
  font-size: 16px;
  color: gray;
`

const RewardValue = styled.span`
  font-size: 24px;
`

const RewardGrid = styled(Grid)`
  width: 100%;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  @media screen and (max-width: 1320px) {
    grid-template-columns: repeat(1, 1fr);
  }
`

const Dividends = () => {
  const { chainId } = useActiveChainId()

  const { lpPrice: ethUsdtLpPrice } = useLpPrice(!chainId ? '' : WETH9[chainId].address, distributedTokenInfo[1].lp)
  const xFlackPrice = useTokenPriceBaseStableCoin(FLACK_ADDRESS)

  const dashboardData = useDashboardData(xFlackPrice, ethUsdtLpPrice)
  const userAllocationData = useUserAllocationData()

  const {
    distributionData,
    nextCycleStartTime,
    refetchContracts: refetchDistributionData,
  } = useDistributionData(xFlackPrice, ethUsdtLpPrice)
  const {
    pendingRewardData,
    totalPendingRewardInUSD,
    refetchContracts: refetchPendingRewardData,
  } = usePendingRewardData(xFlackPrice, ethUsdtLpPrice)

  const refetchData = () => {
    dashboardData.refetchContracts()
    userAllocationData.refetchContracts()
    refetchDistributionData()
    refetchPendingRewardData()
  }
  return (
    <Page>
      <Flex
        flexDirection="column"
        maxWidth={1024}
        width="100%"
        height="100%"
        position="relative"
        alignItems="center"
        style={{ gap: 16 }}
      >
        <EPageHeader pageName="Dividends">
          <Instruction>
            Allocate xFLACK here to earn a share of protocol earnings in the form of real yield.
          </Instruction>
        </EPageHeader>

        <Flex marginTop={36} flexWrap="wrap" style={{ gap: 12 }} justifyContent="center">
          <Flex style={{ gap: 12 }} flexWrap="wrap" justifyContent="center">
            <RewardCard>
              <RewardValue>{dashboardData ? displayNumber(dashboardData.protocolAllocation) : '-'} xFLACK</RewardValue>
              <RewardLabel>Total allocations</RewardLabel>
            </RewardCard>

            <RewardCard>
              <RewardValue>${dashboardData ? displayNumber(dashboardData.currentEpoch) : '-'}</RewardValue>
              <RewardLabel>Current epoch</RewardLabel>
            </RewardCard>
          </Flex>

          <Flex style={{ gap: 12 }} flexWrap="wrap" justifyContent="center">
            <RewardCard>
              <RewardValue>{dashboardData ? Number(dashboardData.apy.toFixed(2)) : '-'}%</RewardValue>
              <RewardLabel>Apy</RewardLabel>
            </RewardCard>

            <RewardCard>
              <RewardValue>{dashboardData ? dashboardData.deAllocationFee : '-'}%</RewardValue>
              <RewardLabel>Deallocation fee</RewardLabel>
            </RewardCard>
          </Flex>
        </Flex>

        <RewardGrid>
          <EpochCard distributionData={distributionData} nextCycleStartTime={nextCycleStartTime} />
          <PendingCard
            pendingRewardData={pendingRewardData}
            totalPendingRewardInUSD={totalPendingRewardInUSD}
            onRefetchData={refetchData}
          />
        </RewardGrid>

        <AllocateCard data={userAllocationData} dashboardData={dashboardData} onRefetchData={refetchData} />
      </Flex>
    </Page>
  )
}

export default Dividends
