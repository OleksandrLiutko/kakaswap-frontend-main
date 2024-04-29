import { Flex, Grid, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import EBoxSm from 'components/EBoxSm'

import styled from 'styled-components'
import { displayNumber } from 'utils/flackHelper'

const CardContent = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 500px;
  cursor: pointer;
  border-radius: 12px;
  &:hover {
    background-color: #33333355;
    transition: background-color 0.3s;
  }
`

const ProtocolName = styled.p`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  margin-bottom: 4px;
`

const ProtocolDetail = styled.p`
  max-width: 420px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.secondary};
`

const RewardTitle = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  margin-bottom: 8px;
`

const RewardValue = styled.p`
  color: white;
  font-size: 14px;
`

const LinkComponent = (linkProps) => {
  return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
}

const ProtocolCard = (props: any) => {
  return (
    <LinkComponent href={props.href} style={{ display: 'flex' }}>
      <CardContent>
        <Flex flexDirection="column" flexGrow={1}>
          <ProtocolName>{props.title}</ProtocolName>
          <ProtocolDetail>{props.content}</ProtocolDetail>
        </Flex>
        <EBoxSm style={{ padding: '16px' }}>
          <Grid
            width="100%"
            justifyContent="start"
            style={{ gap: 20 }}
            flexGrow={1}
            gridTemplateColumns={'1fr 1fr 1fr'}
          >
            <Flex flexDirection="column">
              <RewardTitle>Your allocation</RewardTitle>
              <RewardValue>{displayNumber(props.userAllocation)} xFLACK</RewardValue>
            </Flex>
            <Flex flexDirection="column">
              <RewardTitle>Total allocation</RewardTitle>
              <RewardValue>{displayNumber(props.protocolAllocation)} xFLACK</RewardValue>
            </Flex>
            <Flex flexDirection="column">
              <RewardTitle>Deallocation fee</RewardTitle>
              <RewardValue>{props.deAllocationFee}%</RewardValue>
            </Flex>
          </Grid>
        </EBoxSm>
      </CardContent>
    </LinkComponent>
  )
}

export default ProtocolCard
