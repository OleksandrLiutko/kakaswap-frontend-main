import { Flex } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'

const Inner = styled.div`
  padding: 12px 20px;
  display: flex;
  gap: 6px;
`
const RewardTitle = styled.p`
  color: gray;
  font-size: 20px;
  margin-bottom: 4px;
`
const RewardValue = styled.p`
  color: white;
  font-size: 16px;
`

const RewardCard = (props) => {
  return (
    <EBox>
      <Inner>
        <img src={props.icon} width={40} alt="icon" />
        <Flex flexDirection="column">
          <RewardTitle>{props.title}</RewardTitle>
          <RewardValue>${props.value}</RewardValue>
        </Flex>
      </Inner>
    </EBox>
  )
}

export default RewardCard
