import { EChartIcon, EEarnIcon, Flex } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'

const Inner = styled.div`
  padding: 0 8px;
  display: flex;
  gap: 6px;
  align-items: center;
`

const RewardTitle = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 2px;
`

const RewardValue = styled.p`
  color: white;
  font-size: 14px;
`

const XFlackCard = (props: any) => {
  return (
    <EBox>
      <Inner>
        <Flex flexDirection="column" flexGrow={1}>
          <RewardTitle>{props.title}</RewardTitle>
          <RewardValue>{props.value}</RewardValue>
        </Flex>
        {/* <img src={props.icon} width={24} height={24} alt="icon" /> */}
      </Inner>
    </EBox>
  )
}

export default XFlackCard
