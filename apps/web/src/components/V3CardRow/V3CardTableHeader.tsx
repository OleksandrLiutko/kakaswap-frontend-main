import { styled } from 'styled-components'
import { Text, Grid } from '@pancakeswap/uikit'

const TableRow = styled(Grid)`
  grid-template-columns: 2fr 1fr 1.4fr 1fr 1fr;
  padding: 4px;
  align-items: center;

  > div {
    font-size: 13px;
    color: gray;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    .tbl-range {
      display: none;
    }
  }

  @media screen and (max-width: 680px) {
    grid-template-columns: 2fr 1fr 1fr;
    .tbl-range,
    .tbl-fees {
      display: none;
    }
  }
`
export const V3CardTableHeader = () => {
  return (
    <TableRow>
      <Text className="tbl-token">Token</Text>
      <Text className="tbl-amount">Amount</Text>
      <Text className="tbl-range">Range</Text>
      <Text className="tbl-composition">Composition</Text>
      <Text className="tbl-fees">Pending fees</Text>
    </TableRow>
  )
}
