import { Flex } from '@pancakeswap/uikit'
import EBox from 'components/EBox'
import styled from 'styled-components'

import TableHeader from './TableHeader'

const TableList = styled(EBox)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const HyperPoolsList = ({ children }) => {
  return (
    <Flex flexDirection="column" width="100%" style={{ gap: '12px' }}>
      <TableList>
        <TableHeader />
        {children}
      </TableList>
    </Flex>
  )
}

export default HyperPoolsList
