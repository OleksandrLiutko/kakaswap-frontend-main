import { Flex } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'
import { LAUNCH_LIST } from '../config'
import TableRow from './TableRow'
import TableHeader from './TableHeader'

const TableList = styled(EBox)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const LaunchpadList = () => {
  return (
    <Flex flexDirection="column" width="100%" style={{ gap: '12px' }}>
      {/* <ESearchBox /> */}

      <TableList>
        <TableHeader />
        {LAUNCH_LIST.map((data) => (
          <TableRow data={data} key={data.address} />
        ))}
      </TableList>
    </Flex>
  )
}

export default LaunchpadList
