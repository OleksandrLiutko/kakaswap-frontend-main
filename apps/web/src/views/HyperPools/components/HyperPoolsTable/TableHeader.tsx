import { Box, Grid, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const Container = styled(Grid)`
  grid-template-columns: 2fr 0.5fr 1fr 1fr 1fr 1.2fr 1.2fr;
  border-bottom: 1px solid gray;
  padding: 8px 0;

  > div {
    font-size: 13px;
    color: gray;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 3fr 1fr 1fr 1.2fr 1.2fr;
    .tbl-tvl,
    .tbl-requirements {
      display: none;
    }
  }

  @media screen and (max-width: 680px) {
    grid-template-columns: 2fr 1fr 1fr;
    .tbl-tvl,
    .tbl-incentive,
    .tbl-requirements,
    .tbl-deposit {
      display: none;
    }
  }
`

const TableHeader = () => {
  return (
    <Container>
      <Text className="tbl-pool">Pool</Text>
      <Text className="tbl-tvl">Tvl</Text>
      <Text className="tbl-incentive">Incentives</Text>
      <Text className="tbl-apr">Apr</Text>
      <Text className="tbl-requirements">Requirements</Text>
      <Text className="tbl-deposit">Total deposit</Text>
      <Text className="tbl-reward">Total rewards</Text>
    </Container>
  )
}

export default TableHeader
