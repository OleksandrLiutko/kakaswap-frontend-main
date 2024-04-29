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
    grid-template-columns: 2.4fr 1fr 1fr 1.2fr;
    .tbl-apr {
      display: none;
    }
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: 2.4fr 1fr 1.2fr;
    .tbl-apr,
    .tbl-properties {
      display: none;
    }
  }
`
export const FsNFTCardHeader = () => {
  return (
    <TableRow>
      <Text className="tbl-token">Token</Text>
      <Text className="tbl-deposits">Deposits</Text>
      <Text className="tbl-apr">APR</Text>
      <Text className="tbl-properties">Properties</Text>
      <Text className="tbl-rewards">Pending Rewards</Text>
    </TableRow>
  )
}
