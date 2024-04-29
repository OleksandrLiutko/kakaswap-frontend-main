import { useState } from 'react'
import { styled } from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import Page from 'views/Page'
import { displayNumber } from 'utils/flackHelper'
import EPageHeader from 'components/EPageHeader'
import AllocateCard from './components/AllocateCard'
import InstructionCard from './components/InstructionCard'
import { useUserAllocationData } from './hooks/useUserAllocationData'
import { useLaunchpadData } from './hooks/useLaunchpadData'

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

const Launchpad = () => {
  const userAllocationData = useUserAllocationData()
  const launchpadData = useLaunchpadData()

  const refetchData = () => {
    launchpadData.refetchContracts()
    userAllocationData.refetchContracts()
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
        <EPageHeader pageName="Launchpad">
          <Instruction>
            Allocate xFLACK here to get perks and benefits from every sale happening on Flack's launchpad.
          </Instruction>
        </EPageHeader>

        <Flex marginTop={36} flexWrap="wrap" style={{ gap: 12 }} justifyContent="center">
          <RewardCard>
            <RewardValue>{displayNumber(launchpadData.totalAllocated)} xFLACK</RewardValue>
            <RewardLabel>Total allocations</RewardLabel>
          </RewardCard>

          <RewardCard>
            <RewardValue>{Math.floor(launchpadData.deAllocationCooldown / 24 / 3600)} days</RewardValue>
            <RewardLabel>Deallocation cooldown</RewardLabel>
          </RewardCard>

          <RewardCard>
            <RewardValue>{launchpadData.deAllocationFee}%</RewardValue>
            <RewardLabel>Deallocation fee</RewardLabel>
          </RewardCard>
        </Flex>

        <InstructionCard />

        <AllocateCard userData={userAllocationData} launchpadData={launchpadData} onRefetchData={refetchData} />
      </Flex>
    </Page>
  )
}

export default Launchpad
