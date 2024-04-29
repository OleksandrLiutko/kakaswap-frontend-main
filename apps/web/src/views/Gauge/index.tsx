import { styled } from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import Page from 'views/Page'
import EPageHeader from 'components/EPageHeader'
import VoteCard from './components/VoteCard'

const RewardCard = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  text-align: center;
  gap: 2px;
`

const RewardLabel = styled.label`
  font-size: 13px;
  color: gray;
`

const RewardValue = styled.span`
  font-size: 20px;
`

const Gauge = () => {
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
        <EPageHeader pageName="Gauge" />

        <Flex marginTop={36} flexWrap="wrap" style={{ gap: 12 }} justifyContent="center">
          <Flex style={{ gap: 12 }}>
            <RewardCard>
              <RewardValue>xFLACK balance</RewardValue>
              <RewardLabel>0 xFLACK</RewardLabel>
            </RewardCard>

            <RewardCard>
              <RewardValue>Unused weight</RewardValue>
              <RewardLabel>..</RewardLabel>
            </RewardCard>
          </Flex>

          <Flex style={{ gap: 12 }}>
            <RewardCard>
              <RewardValue>Weekly rewards</RewardValue>
              <RewardLabel>0 FLACK</RewardLabel>
            </RewardCard>

            <RewardCard>
              <RewardValue>Voting time left</RewardValue>
              <RewardLabel>0D 0H 0M</RewardLabel>
            </RewardCard>
          </Flex>
        </Flex>

        <Flex marginTop={36} flexDirection="column" alignItems="center">
          <span style={{ fontSize: 20, marginBottom: 4 }}>Contracts</span>
          <Flex style={{ gap: 4, color: '#72898c', fontSize: 15 }}>
            <span>xFLACK</span> -<span>Rewards Distributor</span> -<span>Gauge Controller</span>
          </Flex>
        </Flex>

        <VoteCard />
      </Flex>
    </Page>
  )
}

export default Gauge
