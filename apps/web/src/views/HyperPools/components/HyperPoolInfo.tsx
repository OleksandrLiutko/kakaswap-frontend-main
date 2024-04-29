import { Flex, Grid, Text } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { displayTime } from 'utils/flackHelper'
import { formatAmount } from 'utils/formatCurrencyAmount'
import { isEnableToDeposit, isEnableToHarvest, isEnded } from '../helpers'

const Container = styled(EBox)`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`
const Card = styled(Grid)`
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;

  @media screen and (max-width: 1200px) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`
const CardTitle = styled(Text)`
  font-size: 24px;
`
const CardItem = styled(Flex)`
  flex-direction: column;
  gap: 8px;

  > :first-child {
    font-size: 14px;
    color: gray;
  }

  @media screen and (max-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;

    > :last-child {
      text-align: right;
    }
  }
`

const HyperPoolInfo = ({ poolData, priceData, apr }) => {
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  const [sumApr, setSumApr] = useState(0)

  useEffect(() => {
    if (!apr) return
    let _apr = 0
    if (apr && apr.fsNFTApr) _apr += apr.fsNFTApr
    if (apr && apr.apr1) _apr += apr.apr1
    if (apr && apr.apr2) _apr += apr.apr2
    setSumApr(_apr)
  }, [apr])

  return (
    <Container>
      <Card>
        <CardTitle>Pool</CardTitle>
        <CardItem>
          <Text>Total value locked</Text>
          <Text>${formatAmount(poolData.totalDepositAmount * priceData.lpPrice)}</Text>
        </CardItem>
        <CardItem>
          <Text>APR</Text>
          <Text>{formatAmount(sumApr)}%</Text>
        </CardItem>
        <CardItem>
          <Text>Pending rewards #1</Text>
          <Text>
            {parseFloat(poolData.rewardsToken0.rewardRemainingAmount).toFixed(2)} {poolData.rewardsToken0.symbol}
            <Text color="gray" fontSize={12}>
              ($
              {priceData.rewardsToken1Price === null
                ? 0
                : formatAmount(priceData.rewardsToken1Price * poolData.rewardsToken0.rewardRemainingAmount)}
              )
            </Text>
          </Text>
        </CardItem>
      </Card>

      <Card>
        <CardTitle>Status</CardTitle>
        <CardItem>
          <Text>Status</Text>
          <Text> {isEnded(poolData.endTime) ? 'Ended' : 'Active'} </Text>
        </CardItem>
        <CardItem>
          <Text>Duration</Text>
          <Text>{displayTime(poolData.endTime - poolData.startTime)}</Text>
        </CardItem>
        <CardItem>
          <Text>End in</Text>
          <Text>
            {poolData.endTime - Math.floor(Date.now() / 1000) - timer < 0
              ? new Date(poolData.endTime * 1000).toLocaleDateString()
              : displayTime(poolData.endTime - Math.floor(Date.now() / 1000) - timer)}
          </Text>
        </CardItem>
      </Card>

      <Card>
        <CardTitle>Authorizations</CardTitle>
        <CardItem>
          <Text>Deposits</Text>
          <Text>{isEnableToDeposit(poolData.endTime, poolData.depositEndTime) ? 'Enabled' : 'Disabled'}</Text>
        </CardItem>
        <CardItem>
          <Text>Deposit end time</Text>
          <Text>
            {poolData.depositEndTime === 0
              ? '-'
              : displayTime(poolData.depositEndTime - Math.floor(Date.now() / 1000) - timer)}
          </Text>
        </CardItem>
        <CardItem>
          <Text>Harvests</Text>
          <Text>{isEnableToHarvest(poolData.harvestStartTime) ? 'Enabled' : poolData.harvestStartTime}</Text>
        </CardItem>
      </Card>

      <Card>
        <CardTitle>Requirements</CardTitle>
        <CardItem>
          <Text>Minimum amount</Text>
          <Text>{poolData.depositAmountReq === 0 ? '-' : poolData.depositAmountReq}</Text>
        </CardItem>
        <CardItem>
          <Text>Minimum lock</Text>
          <Text>{poolData.lockDurationReq === 0 ? '-' : displayTime(poolData.lockDurationReq)}</Text>
        </CardItem>
        <CardItem>
          <Text>Locked until</Text>
          <Text>{poolData.lockEndReq === 0 ? '-' : new Date(poolData.lockEndReq * 1000).toLocaleDateString()}</Text>
        </CardItem>
        <CardItem>
          <Text>Whitelist</Text>
          <Text>{poolData.whitelist ? 'Enabled' : '-'}</Text>
        </CardItem>
      </Card>
    </Container>
  )
}

export default HyperPoolInfo
