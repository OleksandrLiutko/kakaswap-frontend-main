import { styled } from 'styled-components'
import { Text, Grid } from '@pancakeswap/uikit'

const TableRow = styled(Grid)`
  grid-template-columns: 2.4fr 1fr 1fr 1fr 1.2fr;
  padding: 4px;
  align-items: center;

  > div {
    font-size: 13px;
    color: gray;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    .tbl-amount {
      display: none;
    }
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr;
    .tbl-fees,
    .tbl-amount {
      display: none;
    }
  }
`
export const StableCardTableHeader = () => {
  return (
    <TableRow>
      <Text className="tbl-token">Token</Text>
      <Text className="tbl-amount">Amount</Text>
      <Text className="tbl-composition">Composition</Text>
      <Text className="tbl-fees">Fees APR</Text>
      <Text className="tbl-share">Pool share</Text>
    </TableRow>
  )
}
