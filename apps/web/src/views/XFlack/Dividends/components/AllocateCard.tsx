import { Flex, useModal } from '@pancakeswap/uikit'
import EButton from 'components/EButton'

import styled from 'styled-components'
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
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`

const AllocateCard = (props) => {
  const [onPresentTransactionsModal] = useModal(
    <AllocateModal data={props.data} dashboardData={props.dashboardData} onRefetchData={props.onRefetchData} />,
  )

  const getDividendsShare = () => {
    if (!props.data || !props.dashboardData) return 0
    const userValue = props.data.allocated
    const totalValue = props.dashboardData.protocolAllocation
    if (!totalValue || !userValue) return 0
    return Number(((userValue * 100) / totalValue).toFixed(4))
  }

  return (
    <CardContent>
      <Title>Your Allocation</Title>
      <Flex flexDirection="column" width="100%" style={{ gap: 12 }}>
        <Flex justifyContent="space-between">
          <span style={{ color: 'gray' }}>Allocated</span>
          <span>{Number(props.data.allocated.toFixed(4))} xFLACK</span>
        </Flex>
        <Flex justifyContent="space-between">
          <span style={{ color: 'gray' }}>Dividends share</span>
          <span>{getDividendsShare()}%</span>
        </Flex>
        <Flex justifyContent="space-between">
          <span style={{ color: 'gray' }}>Manual allocation</span>
          <span>{Number(props.data.manualAllocation.toFixed(4))} xFLACK</span>
        </Flex>
        <Flex justifyContent="space-between">
          <span style={{ color: 'gray' }}>Redeem allocation</span>
          <span>{Number(props.data.redeemAllocation.toFixed(4))} xFLACK</span>
        </Flex>
      </Flex>
      <EButton handleClick={onPresentTransactionsModal}>Allocate</EButton>
    </CardContent>
  )
}

export default AllocateCard
