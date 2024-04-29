import { Flex, useModal } from '@pancakeswap/uikit'
import Button from 'components/EButton'

import styled from 'styled-components'
import { displayTime } from 'utils/flackHelper'
import { useCallback, useEffect, useState } from 'react'
import AllocateModal from './AllocateModal'

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  gap: 24px;
  width: 100%;
  max-width: 400px;
`
const Title = styled.label`
  font-size: 20px;
  text-align: center;
`

const AllocateCard = ({ userData, launchpadData, onRefetchData }) => {
  const [onAllocateModal] = useModal(
    <AllocateModal userData={userData} launchpadData={launchpadData} onRefetchData={onRefetchData} />,
  )

  const [countTime, setCountTime] = useState(0)
  const [cooldown, setCooldown] = useState(0)

  const getFormattedPercent = (num, denom) => {
    if (denom <= 0) return 0
    if (num / denom < 0.0001) return <>{'< 0.0001'}</>
    return Number(((num / denom) * 100).toFixed(4))
  }

  useEffect(() => {
    const nowTime = Math.floor(Date.now() / 1000) + countTime
    const leftTime = launchpadData.deAllocationCooldown - nowTime + userData.allocatedTime
    if (leftTime < 0) setCooldown(0)
    else setCooldown(leftTime)
  }, [countTime, launchpadData.deAllocationCooldown, userData.allocatedTime])

  useEffect(() => {
    const timerId = setInterval(() => {
      setCountTime((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  return (
    <CardContent>
      <Title>Your Allocation</Title>
      <Flex flexDirection="column" width="100%" style={{ gap: 12 }}>
        <Flex justifyContent="space-between">
          <span style={{ color: 'gray' }}>Allocated</span>
          <span>{userData.allocated} xFLACK</span>
        </Flex>
        <Flex justifyContent="space-between">
          <span style={{ color: 'gray' }}>Launchpad share</span>
          <span>{getFormattedPercent(userData.allocated, launchpadData.totalAllocated)}%</span>
        </Flex>
        <Flex justifyContent="space-between">
          <span style={{ color: 'gray' }}>Deallocation cooldown</span>
          <span>{displayTime(cooldown)}</span>
        </Flex>
      </Flex>

      <Button mt={5} handleClick={onAllocateModal}>
        Allocate
      </Button>
    </CardContent>
  )
}

export default AllocateCard
