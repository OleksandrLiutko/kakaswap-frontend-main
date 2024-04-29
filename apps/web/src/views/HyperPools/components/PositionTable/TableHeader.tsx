import { Box, Grid, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const Container = styled(Grid)`
  grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr;
  border-bottom: 1px solid gray;
  padding: 8px 0;

  > div {
    font-size: 13px;
    color: gray;
  }

  @media screen and (max-width: 680px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    .tbl-properties {
      display: none;
    }
  }
`

const TableHeader = () => {
  return (
    <Container>
      <Text className="tbl-token">Token</Text>
      <Text className="tbl-deposits">Deposits</Text>
      <Text className="tbl-apr">Apr</Text>
      <Text className="tbl-properties">Properties</Text>
      <Text className="tbl-reward">Pending Rewards</Text>
    </Container>
  )
}

export default TableHeader
